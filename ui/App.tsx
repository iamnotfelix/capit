import "react-native-gesture-handler";
import "react-native-get-random-values";

import { StatusBar } from "expo-status-bar";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";

import { AuthProvider } from "./src/contexts/AuthContext";
import { Router } from "./src/navigation/Router";

// import "react-native-url-polyfill/auto";
// import { ReadableStream } from "web-streams-polyfill";
// globalThis.ReadableStream = ReadableStream;

export default function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: 1000 * 60 * 60 * 24, // 24 hours
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        retry: 1,
      },
    },
  });

  const asyncStoragePersister = createAsyncStoragePersister({
    storage: AsyncStorage,
  });

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister: asyncStoragePersister }}
    >
      <AuthProvider>
        <StatusBar style="auto" />
        <Router />
      </AuthProvider>
    </PersistQueryClientProvider>
  );
}
