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
  const lastActivityText = channel.updated_at
    ? formatDistanceToNow(new Date(channel.updated_at), {
        addSuffix: true,
        locale: fr,
      })
    : 'Jamais';

  return (
    <Card
      className="hover:shadow-lg transition-shadow cursor-pointer group"
      onClick={() => onClick(channel)}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1">
            {channel.brand_kit.logo_url ? (
              <img
                src={channel.brand_kit.logo_url}
                alt={channel.name}
                className="w-12 h-12 rounded-lg object-cover"
              />
            ) : (
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-xl"
                style={{ backgroundColor: channel.brand_kit.colors.primary }}
              >
                {channel.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg truncate">{channel.name}</CardTitle>
              {channel.description && (
                <p className="text-sm text-muted-foreground truncate mt-1">
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
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Video className="h-4 w-4" />
            <span>{channel.project_count} projets</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{lastActivityText}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <div className="flex gap-2">
          <Badge
            style={{
              backgroundColor: channel.brand_kit.colors.primary,
              color: 'white',
            }}
          >
            {channel.brand_kit.colors.primary}
          </Badge>
          <Badge
            style={{
              backgroundColor: channel.brand_kit.colors.secondary,
              color: 'white',
            }}
          >
            {channel.brand_kit.colors.secondary}
          </Badge>
          <Badge
            style={{
              backgroundColor: channel.brand_kit.colors.accent,
              color: 'white',
            }}
          >
            {channel.brand_kit.colors.accent}
          </Badge>
        </div>
      </CardFooter>
    </Card>
  );
}
