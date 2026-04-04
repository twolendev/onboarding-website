"use client";
import { Radar, IconContainer } from "@/components/ui/radar-effect";
import { 
  TrendingUp, 
  BookOpenCheck, 
  BatteryCharging, 
  Dumbbell, 
  CalendarDays, 
  Activity, 
  Brain, 
  Apple 
} from "lucide-react";

export function RadarEffectDemo() {
  return (
    <div className="flex w-full items-center justify-center bg-transparent">
      <div className="relative flex min-h-[45rem] w-full max-w-4xl flex-col items-center justify-center space-y-12 overflow-hidden px-4">
        {/* Row 1 */}
        <div className="mx-auto w-full max-w-2xl text-center mb-8">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Scientific Foundations</h2>
            <p className="text-neutral-400">Our AI uses these proven principles to build your plan.</p>
        </div>

        <div className="mx-auto w-full max-w-3xl">
          <div className="flex w-full items-center justify-center space-x-10 md:justify-between md:space-x-0">
            <IconContainer
              text="Progressive Overload"
              delay={0.2}
              icon={<TrendingUp className="h-6 w-6 text-red-500" />}
              explanation="Die Trainingsgewichte schrittweise erhöhen, um den Muskel kontinuierlich zum Wachsen zu zwingen."
            />
            <IconContainer
              delay={0.4}
              text="Meta-Analysis"
              icon={<BookOpenCheck className="h-6 w-6 text-red-500" />}
              explanation="Wir werten Hunderte von Studien aus, um die wirksamste Trainingsmethode wissenschaftlich zu belegen."
            />
            <IconContainer
              text="Recovery Science"
              delay={0.3}
              icon={<BatteryCharging className="h-6 w-6 text-red-500" />}
              explanation="Die Wissenschaft der Erholung: So regeneriert sich dein Körper nach dem Training optimal."
            />
             <IconContainer
              text="Nutrition"
              delay={0.5}
              icon={<Apple className="h-6 w-6 text-red-500" />}
              explanation="Wie du Ernährung ideal einsetzt, um dein volles Leistungspotenzial zu entfalten."
            />
          </div>
        </div>
        
        {/* Row 2 */}
        <div className="mx-auto w-full max-w-3xl mt-8">
          <div className="flex w-full items-center justify-center space-x-10 md:justify-between md:space-x-0">
            <IconContainer
              text="Hypertrophy"
              delay={0.6}
              icon={<Dumbbell className="h-6 w-6 text-red-500" />}
              explanation="Der Prozess des Muskelaufbaus und das gezielte Dickenwachstum deiner Muskelfasern."
            />
            <IconContainer
              text="Periodization"
              delay={0.8}
              icon={<CalendarDays className="h-6 w-6 text-red-500" />}
              explanation="Dein Training wird in Phasen gegliedert, um Plateaus zu vermeiden und dich stetig zu steigern."
            />
            <IconContainer
              delay={0.7}
              text="Muscle Frequency"
              icon={<Activity className="h-6 w-6 text-red-500" />}
              explanation="Die optimale Häufigkeit, mit der jeder Muskel trainiert werden muss, um maximal zu wachsen."
            />
            <IconContainer
              delay={0.9}
              text="RPE Training"
              icon={<Brain className="h-6 w-6 text-red-500" />}
              explanation="Ein System, bei dem dein Training tagesaktuell an dein Energielevel und Wohlbefinden angepasst wird."
            />
          </div>
        </div>

        <Radar className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-60 pointer-events-none" />
      </div>
    </div>
  );
}
