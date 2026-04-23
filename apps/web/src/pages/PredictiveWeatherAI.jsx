import React, { useEffect, useState } from 'react';
import { CloudSun, Wind, Droplets, AlertTriangle, Sun, CloudRain, Gauge, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import mlModelService from '@/lib/mlModelService.js';

export default function PredictiveWeatherAI() {
  const [weather, setWeather] = useState({
    weatherScore: 87,
    current: {
      temperature: 24,
      condition: 'Partly Cloudy',
      humidity: 45,
      wind: 12,
      uv: 'High',
    },
    alerts: [],
    recommendations: [],
    hourly: [],
    daily: [],
  });

  useEffect(() => {
    let active = true;

    const fetchForecast = async () => {
      const inference = await mlModelService.infer('predictive_weather');
      if (!active) return;
      setWeather((prev) => ({
        ...prev,
        ...inference,
      }));
    };

    fetchForecast();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="glass-card rounded-[2rem] p-6 md:p-8"
        >
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
            <div>
              <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-3">
                <Sparkles className="w-3 h-3 mr-1" /> Hyper-local weather intelligence
              </div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                <CloudSun className="w-8 h-8 text-accent" /> Predictive Weather AI
              </h1>
              <p className="text-muted-foreground mt-2">Operational weather forecasts with crop-impact recommendations and risk alerts.</p>
            </div>
            <div className="elevated-card rounded-2xl p-4 min-w-[220px]">
              <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Farm Weather Score</p>
              <div className="flex items-center gap-2 mt-1">
                <Gauge className="w-5 h-5 text-primary" />
                <p className="text-2xl font-bold">{weather.weatherScore} / 100</p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-accent/20 to-background border-accent/30 rounded-3xl elevated-card">
            <CardContent className="p-8 flex flex-col items-center justify-center text-center h-full">
              <CloudSun className="w-24 h-24 text-accent mb-4" />
              <div className="text-5xl font-bold mb-2">{weather.current.temperature}°C</div>
              <p className="text-xl font-medium">{weather.current.condition}</p>
              <div className="flex gap-4 mt-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Droplets className="w-4 h-4" /> {weather.current.humidity}%</span>
                <span className="flex items-center gap-1"><Wind className="w-4 h-4" /> {weather.current.wind} km/h</span>
                <span className="flex items-center gap-1"><Sun className="w-4 h-4" /> UV: {weather.current.uv}</span>
              </div>
            </CardContent>
          </Card>

          <div className="lg:col-span-2 space-y-6">
            <Card className="border-destructive/50 bg-destructive/5 rounded-3xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="w-5 h-5" /> Severe Weather Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-destructive/10 p-4 rounded-lg border border-destructive/20">
                  <h4 className="font-bold text-destructive mb-1">Weather Intelligence Alert</h4>
                  <p className="text-sm text-muted-foreground">{weather.alerts[0] || 'No severe weather alert currently active.'}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl elevated-card">
              <CardHeader>
                <CardTitle>Crop Impact Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center shrink-0">
                    <Droplets className="w-4 h-4 text-secondary" />
                  </div>
                  <div>
                    <p className="font-medium">Irrigation Adjustment</p>
                    <p className="text-sm text-muted-foreground">{weather.recommendations[0] || 'Adjust irrigation based on incoming weather data.'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-medium">Disease Risk Elevated</p>
                    <p className="text-sm text-muted-foreground">{weather.recommendations[1] || 'Monitor disease pressure when humidity stays elevated.'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Tabs defaultValue="hourly" className="w-full">
          <TabsList className="bg-card/80 border border-border/70 p-1 rounded-xl">
            <TabsTrigger value="hourly">Hourly Forecast</TabsTrigger>
            <TabsTrigger value="daily">7-Day Forecast</TabsTrigger>
            <TabsTrigger value="history">Historical Data</TabsTrigger>
          </TabsList>
          
          <TabsContent value="hourly">
            <Card className="rounded-3xl elevated-card">
              <CardContent className="p-6 overflow-x-auto">
                <div className="flex gap-6 min-w-max">
                  {weather.hourly.map((entry) => (
                    <div key={entry.label} className="flex flex-col items-center space-y-2 bg-card/60 border border-border/60 rounded-xl px-4 py-3">
                      <span className="text-sm text-muted-foreground">{entry.label}</span>
                      {entry.rain ? <CloudRain className="w-6 h-6 text-blue-500" /> : <CloudSun className="w-6 h-6 text-accent" />}
                      <span className="font-bold">{entry.temp}°C</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="daily">
            <Card className="rounded-3xl elevated-card">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {weather.daily.map((entry) => (
                    <div key={entry.day} className="flex items-center justify-between p-3 hover:bg-primary/5 rounded-lg transition-colors border border-border/60">
                      <span className="w-12 font-medium">{entry.day}</span>
                      <div className="flex items-center gap-2 w-24">
                        <CloudSun className="w-5 h-5 text-accent" />
                        <span className="text-sm text-muted-foreground">{entry.chance}%</span>
                      </div>
                      <div className="flex gap-4 w-32 justify-end">
                        <span className="font-bold">{entry.max}°</span>
                        <span className="text-muted-foreground">{entry.min}°</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card className="rounded-3xl elevated-card">
              <CardHeader>
                <CardTitle>Historical Weather Context</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Historical trend overlays are enabled for planning irrigation, spray windows, and harvest timing decisions.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}