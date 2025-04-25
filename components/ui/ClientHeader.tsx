import { useTelegramWebApp } from "../../lib/telegram-init";

export function ClientHeader() {
  const { user } = useTelegramWebApp();
  return (
    <header className="flex items-center justify-between mb-8">
      <h1 className="text-3xl font-bold tracking-wide">WhaleBux Mining App</h1>
      {user && (
        <div className="flex items-center space-x-4">
          {user.photoUrl && (
            <img 
              src={user.photoUrl} 
              alt={`${user.firstName} ${user.lastName}`} 
              className="h-10 w-10 rounded-full border-2 border-gray-700" 
            />
          )}
          <span className="text-lg font-semibold">
            {user.firstName} {user.lastName}
          </span>
        </div>
      )}
    </header>
  );
}
