import { TanStackDevtools } from '@tanstack/react-devtools'
import type { QueryClient } from '@tanstack/react-query'
import {
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { Header } from '@/components/Header'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Toaster } from '@/components/ui/sonner'
import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'
import appCss from '../styles.css?url'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'GoodSync',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <head>
        <HeadContent />
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: prevent flickering
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var storageKey = 'ui-theme';
                  var theme = document.cookie.match(new RegExp('(^| )' + storageKey + '=([^;]+)'));
                  var resolvedTheme = theme ? theme[2] : 'system';
                  
                  if (resolvedTheme === 'system') {
                    var isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    document.documentElement.classList.add(isDark ? 'dark' : 'light');
                  } else {
                    document.documentElement.classList.add(resolvedTheme);
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        <ThemeProvider defaultTheme='system'>
          <Header />
          {children}
          <Toaster />
          <TanStackDevtools
            config={{
              position: 'bottom-right',
            }}
            plugins={[
              {
                name: 'Tanstack Router',
                render: <TanStackRouterDevtoolsPanel />,
              },
              TanStackQueryDevtools,
            ]}
          />
          <Scripts />
        </ThemeProvider>
      </body>
    </html>
  )
}
