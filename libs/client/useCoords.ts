import { useCallback, useEffect, useState } from "react";

interface Coords {
  latitude: number | null;
  longitude: number | null;
}

export default function useCoords() {
  const [coords, setCoords] = useState<Coords>({
    latitude: null,
    longitude: null,
  });

  const onSuccess: PositionCallback = useCallback(
    ({ coords: { latitude, longitude } }: GeolocationPosition) => {
      setCoords({ latitude, longitude });
    },
    []
  );

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(onSuccess);
  }, [onSuccess]);

  return coords;
}
