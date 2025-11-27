import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { AdminLayout } from "@/components/admin/admin-sidebar";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Mail, MailOpen, Trash2, Eye, Loader2, Calendar, User } from "lucide-react";
import type { ContactMessage } from "@shared/schema";

export default function AdminMessages() {
  const { toast } = useToast();
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data: messages, isLoading } = useQuery<ContactMessage[]>({
    queryKey: ["/api/admin/messages"],
  });

  const markReadMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("PUT", `/api/admin/messages/${id}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/messages"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/admin/messages/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/messages"] });
      toast({ title: "Message Deleted", description: "The message has been removed." });
      setDeleteId(null);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete message.", variant: "destructive" });
    },
  });

  const openMessage = (message: ContactMessage) => {
    setSelectedMessage(message);
    if (!message.readStatus) {
      markReadMutation.mutate(message.id);
    }
  };

  const unreadCount = messages?.filter((m) => !m.readStatus).length || 0;

  const formatDate = (date: Date | string | null) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold" data-testid="text-messages-title">
              Messages
            </h1>
            <p className="text-muted-foreground mt-1">
              Contact form submissions from your website
            </p>
          </div>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="text-sm">
              {unreadCount} unread
            </Badge>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        ) : messages && messages.length > 0 ? (
          <div className="space-y-3">
            {messages.map((message) => (
              <Card
                key={message.id}
                className={`cursor-pointer transition-all hover-elevate ${
                  !message.readStatus ? "border-primary/30 bg-primary/5" : ""
                }`}
                onClick={() => openMessage(message)}
                data-testid={`card-message-${message.id}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-2 rounded-full ${
                        message.readStatus
                          ? "bg-muted"
                          : "bg-primary/10"
                      }`}
                    >
                      {message.readStatus ? (
                        <MailOpen className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <Mail className="w-5 h-5 text-primary" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{message.name}</span>
                          {!message.readStatus && (
                            <Badge size="sm" className="text-xs">New</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            {formatDate(message.createdAt)}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteId(message.id);
                            }}
                            data-testid={`button-delete-message-${message.id}`}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground">{message.email}</p>
                      
                      {message.subject && (
                        <p className="font-medium text-sm">{message.subject}</p>
                      )}
                      
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {message.message}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <Mail className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No messages yet.</p>
              <p className="text-sm text-muted-foreground mt-1">
                Messages from your contact form will appear here.
              </p>
            </CardContent>
          </Card>
        )}

        <Dialog open={selectedMessage !== null} onOpenChange={() => setSelectedMessage(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <MailOpen className="w-5 h-5" />
                Message Details
              </DialogTitle>
            </DialogHeader>
            {selectedMessage && (
              <div className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-muted">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">From</p>
                      <p className="font-medium">{selectedMessage.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-muted">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <a
                        href={`mailto:${selectedMessage.email}`}
                        className="font-medium text-primary hover:underline"
                      >
                        {selectedMessage.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:col-span-2">
                    <div className="p-2 rounded-lg bg-muted">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Received</p>
                      <p className="font-medium">{formatDate(selectedMessage.createdAt)}</p>
                    </div>
                  </div>
                </div>

                {selectedMessage.subject && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Subject</p>
                    <p className="font-medium text-lg">{selectedMessage.subject}</p>
                  </div>
                )}

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Message</p>
                  <div className="p-4 rounded-lg bg-muted/50 whitespace-pre-wrap">
                    {selectedMessage.message}
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedMessage(null)}
                  >
                    Close
                  </Button>
                  <Button asChild>
                    <a href={`mailto:${selectedMessage.email}`}>
                      Reply via Email
                    </a>
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Message</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this message? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteId && deleteMutation.mutate(deleteId)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {deleteMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Delete"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
}
