import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Skill } from "@shared/schema";

interface SkillsSectionProps {
  skills?: Skill[];
  isLoading?: boolean;
}

export function SkillsSection({ skills, isLoading }: SkillsSectionProps) {
  const categories = skills
    ? [...new Set(skills.map((skill) => skill.category || "Other"))]
    : [];

  const getSkillsByCategory = (category: string) =>
    skills?.filter((skill) => (skill.category || "Other") === category) || [];

  return (
    <section
      id="skills"
      className="py-20 md:py-32"
      data-testid="section-skills"
    >
      <div className="max-w-6xl mx-auto px-6 md:px-8">
        <h2 className="font-display text-4xl md:text-5xl font-bold text-center mb-6" data-testid="text-skills-heading">
          Skills & Expertise
        </h2>
        <p className="text-center text-muted-foreground text-lg max-w-2xl mx-auto mb-16">
          Technologies and tools I work with to bring ideas to life
        </p>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-muted rounded-lg mb-4" />
                  <div className="h-5 bg-muted rounded w-3/4 mb-3" />
                  <div className="h-2 bg-muted rounded w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : skills && skills.length > 0 ? (
          categories.length > 1 ? (
            <Tabs defaultValue={categories[0]} className="w-full">
              <TabsList className="flex flex-wrap justify-center mb-8 h-auto gap-2 bg-transparent">
                {categories.map((category) => (
                  <TabsTrigger
                    key={category}
                    value={category}
                    className="px-6 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    data-testid={`tab-skill-${category.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
              {categories.map((category) => (
                <TabsContent key={category} value={category}>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {getSkillsByCategory(category).map((skill) => (
                      <SkillCard key={skill.id} skill={skill} />
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {skills.map((skill) => (
                <SkillCard key={skill.id} skill={skill} />
              ))}
            </div>
          )
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No skills added yet.</p>
          </div>
        )}
      </div>
    </section>
  );
}

function SkillCard({ skill }: { skill: Skill }) {
  return (
    <Card className="overflow-visible hover-elevate active-elevate-2 transition-all duration-300" data-testid={`card-skill-${skill.id}`}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4 mb-4">
          {skill.logo ? (
            <img
              src={skill.logo}
              alt={skill.name}
              className="w-12 h-12 object-contain"
            />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">
                {skill.name.charAt(0)}
              </span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate" data-testid={`text-skill-name-${skill.id}`}>
              {skill.name}
            </h3>
            {skill.category && (
              <Badge variant="secondary" className="mt-1 text-xs">
                {skill.category}
              </Badge>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Proficiency</span>
            <span className="font-medium">{skill.proficiency}%</span>
          </div>
          <Progress value={skill.proficiency || 0} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}
