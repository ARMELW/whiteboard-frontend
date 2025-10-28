import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Channel } from '../types';
import { Settings, Video, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ChannelCardProps {
  channel: Channel;
  onSettings: (channel: Channel) => void;
  onClick: (channel: Channel) => void;
}

export function ChannelCard({ channel, onSettings, onClick }: ChannelCardProps) {
  const lastActivity = channel.updatedAt
    ? formatDistanceToNow(new Date(channel.updatedAt), { addSuffix: true, locale: fr })
    : 'Jamais';

  return (
    <Card
      className="group cursor-pointer transition-all hover:shadow-lg hover:scale-[1.01]"
      onClick={() => onClick(channel)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {channel.brandKit.logo_url ? (
              <img
                src={channel.brandKit.logo_url}
                alt={channel.name}
                className="w-12 h-12 rounded-lg object-cover shrink-0"
              />
            ) : (
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-semibold text-xl shrink-0"
                style={{ backgroundColor: channel.brandKit.colors.primary }}
              >
                {channel.name[0].toUpperCase()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg truncate">{channel.name}</CardTitle>
              {channel.description && (
                <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">
                  {channel.description}
                </p>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onSettings(channel);
            }}
            className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Paramètres"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Video className="h-4 w-4" />
            <span>{channel.projectCount} {channel.projectCount > 1 ? 'projets' : 'projet'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            <span>{lastActivity}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}