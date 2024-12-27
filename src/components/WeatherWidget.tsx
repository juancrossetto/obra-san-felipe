'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Cloud, Sun, CloudRain } from 'lucide-react'
import { Skeleton } from './ui/skeleton'

interface WeatherData {
  temperature: number
  condition: 'sunny' | 'cloudy' | 'rainy'
}

const getWeatherIcon = (condition: string | undefined) => {
  if (!condition) return null;

  const normalizedCondition = condition.toLowerCase();

  switch (normalizedCondition) {
    case 'clear':
      return <Sun className="h-6 w-6 text-yellow-500" />;
    case 'clouds':
      return <Cloud className="h-6 w-6 text-gray-500" />;
    case 'rain':
    case 'drizzle': // Lluvias ligeras
      return <CloudRain className="h-6 w-6 text-blue-500" />;
    case 'thunderstorm': // Tormentas
      return <CloudRain className="h-6 w-6 text-purple-500" />;
    case 'snow': // Nieve
      return <Cloud className="h-6 w-6 text-white" />;
    default:
      return <Cloud className="h-6 w-6 text-gray-500" />;
  }
};

const translateCondition = (condition: string | undefined): string => {
  if (!condition) return 'Desconocido';

  const translations: Record<string, string> = {
    clear: 'Despejado',
    clouds: 'Nublado',
    rain: 'Lluvioso',
    drizzle: 'Llovizna',
    thunderstorm: 'Tormenta',
    snow: 'Nevado',
    mist: 'Neblina',
    smoke: 'Humo',
    haze: 'Calina',
    dust: 'Polvo',
    fog: 'Niebla',
    sand: 'Arena',
    ash: 'Ceniza volcánica',
    squall: 'Chubasco',
    tornado: 'Tornado',
  };

  return translations[condition.toLowerCase()] || 'Condición desconocida';
};

export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Ubicación deseada
        const city = 'Buenos Aires';
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}`;

        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`Error al obtener el clima: ${response.status}`);
        }

        const data = await response.json();

        // Procesar los datos de la API
        const weatherData: WeatherData = {
          temperature: Math.round(data.main.temp), // Temperatura en °C
          condition: data.weather[0].main.toLowerCase(), // Condición climática (ej. "clear", "clouds")
        };

        setWeather(weatherData);
        setIsLoading(false);
      } catch (err: any) {
        setError(err.message || 'Error al cargar el clima.');
        setIsLoading(false);
      }
    };

    fetchWeather();
  }, []);

  if (isLoading) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Clima Actual</CardTitle>
				</CardHeader>
				<CardContent>
					<Skeleton className='h-8 w-[120px]' />
				</CardContent>
			</Card>
		);
	}

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Clima Actual</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold">{weather?.temperature}°C</div>
            <p className="text-xs text-muted-foreground mt-1 capitalize">{translateCondition(weather?.condition)}</p>
          </div>
          {getWeatherIcon(weather?.condition)}
        </div>
      </CardContent>
    </Card>
  )
}

