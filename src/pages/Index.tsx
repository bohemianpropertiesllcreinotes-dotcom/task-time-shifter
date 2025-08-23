import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TaskBreakdown } from "@/components/TaskBreakdown";
import { ScheduleView } from "@/components/ScheduleView";
import { Calendar, ListTodo, Brain } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-background/95 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Task Time Shifter
              </h1>
            </div>
            <p className="text-sm text-muted-foreground hidden sm:block">
              Smart task scheduling around your daily commitments
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">
            Break Down. Schedule. Accomplish.
          </h2>
          <p className="text-lg text-muted-foreground">
            Transform overwhelming tasks into manageable pieces that fit perfectly into your day.
          </p>
        </div>

        <Tabs defaultValue="tasks" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="tasks" className="flex items-center gap-2">
              <ListTodo className="h-4 w-4" />
              Tasks
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Schedule
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tasks">
            <TaskBreakdown />
          </TabsContent>

          <TabsContent value="schedule">
            <ScheduleView />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;