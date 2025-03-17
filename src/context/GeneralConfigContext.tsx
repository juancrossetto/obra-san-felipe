// src/context/GeneralConfigContext.tsx

import React, { createContext, useContext, useState } from "react";

// Definimos la interfaz para los colores
interface GeneralConfig {
	primaryColor: string;
	secondaryColor: string;
	tertiaryColor: string;
}

// Definimos el tipo del contexto
interface GeneralConfigContextType {
	config: GeneralConfig;
	updateConfig: (newConfig: Partial<GeneralConfig>) => void;
}

// Creamos el contexto con valores iniciales por defecto
const GeneralConfigContext = createContext<
	GeneralConfigContextType | undefined
>(undefined);

// Proveedor del contexto
export const GeneralConfigProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	// Estado inicial de la configuración
	const [config, setConfig] = useState<GeneralConfig>({
		primaryColor: "#3498db", // Azul claro
		secondaryColor: "#2ecc71", // Verde claro
		tertiaryColor: "#e74c3c", // Rojo claro
	});

	// Función para actualizar la configuración
	const updateConfig = (newConfig: Partial<GeneralConfig>) => {
		setConfig((prevConfig) => ({
			...prevConfig,
			...newConfig,
		}));
	};

	return (
		<GeneralConfigContext.Provider value={{ config, updateConfig }}>
			{children}
		</GeneralConfigContext.Provider>
	);
};

// Hook personalizado para usar el contexto
export const useGeneralConfig = () => {
	const context = useContext(GeneralConfigContext);
	if (!context) {
		throw new Error(
			"useGeneralConfig debe ser usado dentro de un GeneralConfigProvider"
		);
	}
	return context;
};
