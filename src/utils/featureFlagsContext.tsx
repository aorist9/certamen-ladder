import React, { createContext, useContext, ReactNode, useEffect } from "react";
import f from "./features.json";
import { useSearchParams } from "react-router-dom";

type FeatureFlags = {
	[key: string]: boolean;
};

const FeatureFlagsContext = createContext<FeatureFlags>(f);

export const FeatureFlagsProvider = ({ children }: { children: ReactNode }) => {
	const [features, setFeatures] = React.useState<FeatureFlags>(f);
	const [query] = useSearchParams();

	useEffect(() => {
		setFeatures(fs =>
			Object.keys(fs).reduce((acc, feature) => {
				if (
					query.get(`${feature}OVERRIDE`) === "true" ||
					query.get(`${feature}OVERRIDE`) === "false"
				) {
					return {
						...acc,
						[feature]: query.get(`${feature}OVERRIDE`) === "true"
					};
				} else {
					return { ...acc, [feature]: fs[feature] };
				}
			}, {})
		);
	}, [query]);

	return (
		<FeatureFlagsContext.Provider value={features}>
			{children}
		</FeatureFlagsContext.Provider>
	);
};

export const useFeatureFlags = (): FeatureFlags => {
	const context = useContext(FeatureFlagsContext);
	if (!context) {
		throw new Error(
			"useFeatureFlags must be used within a FeatureFlagsProvider"
		);
	}
	return context;
};
