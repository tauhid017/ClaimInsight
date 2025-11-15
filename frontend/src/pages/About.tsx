import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info, Linkedin, Github, Globe } from "lucide-react";

export default function About() {
  const teamMembers = [
    {
      name: "Shivam Verma",
      role: "Developer",
      linkedin: "#",
      github: "#",
      website: "#",
    },
    {
      name: "Shaikh Tauhid",
      role: "Developer",
      linkedin: "#",
      github: "#",
      website: "#",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple via-purple-light to-cyan">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-cyan mb-6 flex items-center gap-2">
              <Info className="h-6 w-6" />
              About ClaimInsight
            </h2>

            <div className="space-y-6">
              <div>
                <p className="text-lg leading-relaxed">
                  ClaimInsight is an AI-powered web application designed to automatically
                  generate professional insurance loss descriptions from damage images.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-cyan mb-3 flex items-center gap-2">
                  💡 Key Features:
                </h3>
                <ul className="space-y-2 ml-6">
                  <li className="list-disc">Upload damage images for instant analysis</li>
                  <li className="list-disc">AI-powered image recognition</li>
                  <li className="list-disc">Professional insurance descriptions</li>
                  <li className="list-disc">Download PDF reports</li>
                  <li className="list-disc">Track your claim history</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-cyan mb-4 flex items-center gap-2">
                  👥 Team:
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {teamMembers.map((member) => (
                    <Card key={member.name} className="p-6">
                      <h4 className="font-semibold text-lg mb-1">{member.name}</h4>
                      <p className="text-muted-foreground mb-4">{member.role}</p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => window.open(member.linkedin, "_blank")}
                        >
                          <Linkedin className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => window.open(member.github, "_blank")}
                        >
                          <Github className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => window.open(member.website, "_blank")}
                        >
                          <Globe className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="bg-cyan/10 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-cyan mb-2">
                  How It Works
                </h3>
                <ol className="space-y-2 ml-6">
                  <li className="list-decimal">Upload an image of the damage</li>
                  <li className="list-decimal">Select or specify the damage type</li>
                  <li className="list-decimal">AI analyzes the image and generates a professional description</li>
                  <li className="list-decimal">Download your report as PDF or text</li>
                  <li className="list-decimal">Access your history anytime</li>
                </ol>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
