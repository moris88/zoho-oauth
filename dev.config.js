/* eslint-disable no-undef */
import c from 'ansi-colors'
import concurrently from 'concurrently'

const { log: logger } = console

const { result: run } = concurrently(
  [
    {
      command: 'vite',
      name: 'vite',
      prefixColor: 'blue',
    },
    {
      command: 'pnpm serve',
      name: 'server',
      prefixColor: 'yellow',
    },
  ],
  {
    prefix: '[dev]',
    killOthers: ['failure', 'success'],
    restartTries: 3,
    maxProcesses: 3,
  }
)

try {
  logger(`
__________     .__                                  __  .__     
\\____    /____ |  |__   ____     _________   __ ___/  |_|  |__  
  /     //  _ \\|  |  \\ /  _ \\   /  _ \\__  \\ |  |  \\   __\\  |  \\ 
 /     /(  <_> )   Y  (  <_> ) (  <_> ) __ \\|  |  /|  | |   Y  \\
/_______ \\____/|___|  /\\____/   \\____(____  /____/ |__| |___|  /
        \\/          \\/                    \\/                 \\/ 
`)

  logger(c.bgBlue(c.white('Run dev commands...')))
  run.then(
    () => {
      process.exit(0)
    },
    () => {
      process.exit(1)
    }
  )
} catch (error) {
  logger(error)
  process.exit(1)
}
