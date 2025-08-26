import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Plus, X, CheckCircle } from "lucide-react";
import { Obligation, ScheduledSlot } from "@/types/scheduler";

interface TimeSlot {
  start: string;
  end: string;
  duration: number;
  available: boolean;
  energyLevel?: string;
}

interface ScheduleViewProps {
  obligations: Obligation[];
  onAddObligation: (obligation: Omit<Obligation, 'id'>) => void;
  onRemoveObligation: (id: string) => void;
  scheduledSlots: ScheduledSlot[];
}

export const ScheduleView = ({ 
  obligations, 
  onAddObligation, 
  onRemoveObligation, 
  scheduledSlots 
}: ScheduleViewProps) => {
  
  const [showForm, setShowForm] = useState(false);
  const [newObligation, setNewObligation] = useState({
    title: "",
    startTime: "",
    endTime: "",
    type: "personal" as Obligation["type"]
  });

  const generateTimeSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const dayStart = 7; // 7 AM
    const dayEnd = 22; // 10 PM
    
    // Sort obligations by start time
    const sortedObligations = [...obligations].sort((a, b) => 
      a.startTime.localeCompare(b.startTime)
    );

    let currentHour = dayStart;
    let currentMinute = 0;

    for (const obligation of sortedObligations) {
      const obligationStart = parseTime(obligation.startTime);
      const obligationEnd = parseTime(obligation.endTime);
      
      // Add available slot before obligation if there's time
      if (currentHour * 60 + currentMinute < obligationStart.totalMinutes) {
        const availableMinutes = obligationStart.totalMinutes - (currentHour * 60 + currentMinute);
        if (availableMinutes >= 15) { // Only show slots of 15+ minutes
          slots.push({
            start: formatTime(currentHour, currentMinute),
            end: formatTime(obligationStart.hour, obligationStart.minute),
            duration: availableMinutes,
            available: true
          });
        }
      }
      
      // Add the obligation slot
      slots.push({
        start: obligation.startTime,
        end: obligation.endTime,
        duration: obligationEnd.totalMinutes - obligationStart.totalMinutes,
        available: false
      });
      
      currentHour = obligationEnd.hour;
      currentMinute = obligationEnd.minute;
    }
    
    // Add final available slot if there's time left in the day
    const dayEndMinutes = dayEnd * 60;
    const currentTotalMinutes = currentHour * 60 + currentMinute;
    if (currentTotalMinutes < dayEndMinutes) {
      const remainingMinutes = dayEndMinutes - currentTotalMinutes;
      if (remainingMinutes >= 15) {
        slots.push({
          start: formatTime(currentHour, currentMinute),
          end: formatTime(dayEnd, 0),
          duration: remainingMinutes,
          available: true
        });
      }
    }
    
    return slots;
  };

  const parseTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return {
      hour: hours,
      minute: minutes,
      totalMinutes: hours * 60 + minutes
    };
  };

  const formatTime = (hour: number, minute: number) => {
    return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
  };

  const addObligation = () => {
    if (!newObligation.title || !newObligation.startTime || !newObligation.endTime) return;
    
    onAddObligation(newObligation);
    setNewObligation({ title: "", startTime: "", endTime: "", type: "personal" });
    setShowForm(false);
  };

  const removeObligation = (id: string) => {
    onRemoveObligation(id);
  };

  const getTypeColor = (type: Obligation["type"]) => {
    switch (type) {
      case "work": return "bg-task-primary";
      case "personal": return "bg-task-success";
      case "appointment": return "bg-obligation";
      default: return "bg-muted";
    }
  };

  const timeSlots = generateTimeSlots();
  const availableSlots = timeSlots.filter(slot => slot.available);
  const totalAvailableTime = availableSlots.reduce((total, slot) => total + slot.duration, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Daily Schedule
          </h2>
          <p className="text-muted-foreground">
            {totalAvailableTime} minutes available for tasks today
          </p>
        </div>
        <Button 
          onClick={() => setShowForm(!showForm)}
          className="bg-task-primary hover:bg-task-secondary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Obligation
        </Button>
      </div>

      {showForm && (
        <Card className="p-6 bg-gradient-card">
          <div className="space-y-4">
            <Input
              placeholder="Obligation title (e.g., Team meeting, Gym session)"
              value={newObligation.title}
              onChange={(e) => setNewObligation({ ...newObligation, title: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Start Time</label>
                <Input
                  type="time"
                  value={newObligation.startTime}
                  onChange={(e) => setNewObligation({ ...newObligation, startTime: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">End Time</label>
                <Input
                  type="time"
                  value={newObligation.endTime}
                  onChange={(e) => setNewObligation({ ...newObligation, endTime: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Type</label>
              <select
                value={newObligation.type}
                onChange={(e) => setNewObligation({ ...newObligation, type: e.target.value as Obligation["type"] })}
                className="w-full p-2 border rounded-md bg-background"
              >
                <option value="personal">Personal</option>
                <option value="work">Work</option>
                <option value="appointment">Appointment</option>
              </select>
            </div>
            <div className="flex gap-2">
              <Button onClick={addObligation} className="bg-task-primary hover:bg-task-secondary">
                Add Obligation
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Timeline View */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Today's Timeline
          </h3>
          <div className="space-y-2">
            {timeSlots.map((slot, index) => {
              // Check if there's a scheduled task in this slot
              const scheduledTask = scheduledSlots.find(scheduled => 
                scheduled.startTime === slot.start && scheduled.endTime === slot.end
              );
              
              return (
                <div
                  key={index}
                  className={`p-3 rounded-lg border-l-4 ${
                    scheduledTask
                      ? "bg-task-primary/10 border-l-task-primary"
                      : slot.available 
                        ? "bg-time-slot border-l-task-success" 
                        : "bg-muted border-l-muted-foreground"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {slot.start} - {slot.end}
                    </span>
                    <div className="flex items-center gap-2">
                      <Badge variant={slot.available ? "default" : "secondary"}>
                        {slot.duration}min
                      </Badge>
                      {slot.energyLevel && (
                        <Badge variant="outline" className="text-xs">
                          {slot.energyLevel} energy
                        </Badge>
                      )}
                    </div>
                  </div>
                  {scheduledTask ? (
                    <div className="flex items-center gap-2 mt-1">
                      <CheckCircle className="h-4 w-4 text-task-primary" />
                      <p className="text-sm text-task-primary font-medium">
                        Scheduled Task ({scheduledTask.location})
                      </p>
                    </div>
                  ) : slot.available ? (
                    <p className="text-sm text-muted-foreground mt-1">
                      Available for tasks
                    </p>
                  ) : null}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Obligations List */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Fixed Obligations
          </h3>
          <div className="space-y-3">
            {obligations.map((obligation) => (
              <div
                key={obligation.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-background/50"
              >
                <div className={`w-3 h-3 rounded-full ${getTypeColor(obligation.type)}`} />
                <div className="flex-1">
                  <p className="font-medium">{obligation.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {obligation.startTime} - {obligation.endTime}
                  </p>
                </div>
                <Badge variant="outline" className="capitalize">
                  {obligation.type}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeObligation(obligation.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Available Time Summary */}
      <Card className="p-6 bg-gradient-subtle">
        <div className="text-center space-y-3">
          <h3 className="text-lg font-semibold">Available Time Summary</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-2xl font-bold text-task-success">{availableSlots.length}</p>
              <p className="text-sm text-muted-foreground">Available Slots</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-task-primary">{Math.floor(totalAvailableTime / 60)}h {totalAvailableTime % 60}m</p>
              <p className="text-sm text-muted-foreground">Total Available</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-task-secondary">{obligations.length}</p>
              <p className="text-sm text-muted-foreground">Fixed Obligations</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};