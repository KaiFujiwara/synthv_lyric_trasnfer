import React from 'react';
import Chat from "../components/Chat";

export default function Home() {
  return (
    <div className="flex flex-col min-h-dvh sm:min-h-screen sm:pb-6 gap-16">
      <main >
        <Chat />
      </main>
    </div>
  );
}
