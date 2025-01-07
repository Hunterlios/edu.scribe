import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export default function AvatarHoverCard(params: { i: number }) {
  const { i } = params;

  return (
    <HoverCard>
      <HoverCardTrigger>
        <Avatar>
          <AvatarImage src={`/avatar-${i}.svg`} />
          <AvatarFallback>{i}</AvatarFallback>
        </Avatar>
      </HoverCardTrigger>
      <HoverCardContent className="flex flex-col justify-center items-center rounded-full w-fit pt-0 pb-8 z-50">
        <Avatar className="w-full h-full">
          <AvatarImage src={`/avatar-${i}.svg`} />
          <AvatarFallback>{i}</AvatarFallback>
        </Avatar>
      </HoverCardContent>
    </HoverCard>
  );
}
