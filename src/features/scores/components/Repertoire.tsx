import { useLiveQuery } from '@tanstack/react-db'
import {
  Hourglass,
  Loader2,
  Music2,
  Play,
  Plus,
  Search,
  SkipBack,
  SkipForward,
} from 'lucide-react'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Slider } from '@/components/ui/slider'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { songsCollection } from '../db/collections'
import type { Song } from '../db/schema'

function StatusBadge({ status }: { status: Song['status'] }) {
  switch (status) {
    case 'COMPLETED':
      return (
        <Badge variant='default' className='text-[10px] h-5 w-12'>
          FERTIG
        </Badge>
      )
    case 'FAILED':
      return (
        <Badge variant='destructive' className='text-[10px] h-5 w-12'>
          FEHLER
        </Badge>
      )
    case 'PENDING':
      return (
        <Badge variant='secondary' className='text-[10px] h-5 w-12 '>
          <Hourglass className='animate-pulse-slow' />
        </Badge>
      )
    case 'PROCESSING':
      return (
        <Badge variant='secondary' className='text-[10px] h-5 w-12 '>
          <Loader2 className='animate-spin' />
        </Badge>
      )
    default:
      return (
        <Badge variant='outline' className='text-[10px] h-5 w-12'>
          ???
        </Badge>
      )
  }
}

export function Repertoire() {
  const [currentVoice, setCurrentVoice] = useState('gesamt')

  const { data: songs } = useLiveQuery((q) =>
    q.from({ songsCollection }).orderBy((q) => q.songsCollection.createdAt),
  )

  console.log(songs)

  return (
    <div className='flex flex-col bg-background text-foreground'>
      {/* Header */}
      <header className='p-4 space-y-4'>
        <div className='flex gap-2'>
          <div className='relative flex-1'>
            <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
            <Input placeholder='Song suchen...' className='pl-8 bg-muted/50' />
          </div>
          <Button className='bg-primary text-primary-foreground'>
            <Plus className='mr-2 h-4 w-4' /> Neu
          </Button>
        </div>
      </header>

      {/* Main Content - Repertoire List */}
      <ScrollArea className='flex-1 px-4'>
        <h2 className='text-xs font-semibold mb-4 opacity-50 uppercase tracking-wider'>
          Aktuelles Repertoire{' '}
          <span className='float-right text-[10px]'>{songs.length} Titel</span>
        </h2>

        <div className='space-y-3 pb-32'>
          {songs.map((song) => {
            return (
              <div
                key={song.id}
                className='flex items-center gap-4 p-3 rounded-xl bg-card border border-transparent hover:border-primary/50 transition-colors'
              >
                <div className='h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center text-primary'>
                  <Music2 />
                </div>
                <div className='flex-1'>
                  <h3 className='font-medium leading-none'>{song.title}</h3>
                  {/* <p className='text-sm text-muted-foreground mt-1'>
                    Leonard Cohen
                  </p> */}
                  <div className='flex items-center gap-2 mt-2'>
                    <StatusBadge status={song.status} />

                    <span className='text-[10px] opacity-60 flex items-center gap-1 text-destructive'>
                      <Music2 className='h-3 w-3' /> 5 Stimmen TODO
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </ScrollArea>

      {/* Persistent Audio Player Container */}
      <footer className='fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t p-4 pb-8 lg:pb-4'>
        <div className='max-w-3xl mx-auto space-y-4'>
          <div className='text-center'>
            <p className='text-[10px] text-primary uppercase font-bold'>
              Jetzt Hören: Gesamt
            </p>
            <p className='font-semibold'>The Parting Glass</p>
          </div>

          <ToggleGroup
            type='single'
            value={currentVoice}
            onValueChange={(v) => v && setCurrentVoice(v)}
            className='justify-center flex-wrap'
          >
            {['Sopran', 'Alt', 'Tenor', 'Bass', 'Gesamt'].map((v) => (
              <ToggleGroupItem
                key={v}
                value={v.toLowerCase()}
                className='rounded-full px-4 h-8 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground'
              >
                {v}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>

          <div className='space-y-2'>
            <Slider defaultValue={[33]} max={100} step={1} className='w-full' />
            <div className='flex justify-center items-center gap-8'>
              <Button variant='ghost' size='icon'>
                <SkipBack />
              </Button>
              <Button
                size='icon'
                className='h-14 w-14 rounded-full bg-foreground text-background'
              >
                <Play className='fill-current h-6 w-6' />
              </Button>
              <Button variant='ghost' size='icon'>
                <SkipForward />
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
