'use client'

import Link from 'next/link'

import { Group, Burger, Title, Drawer, Center } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconWallet } from '@tabler/icons-react'

import classes from './Navbar.module.css'
import { LogoutButton } from './LogoutButton'
import { useAuthContext } from '@/app/hooks/auth'

export function Navbar () {
  const { user } = useAuthContext()
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false)

  return (
    <>
      <header className={classes.header}>
        <Group justify="space-between" sx={{ height: '100%' }}>
          <Group>
            <Link href="/">
              <Group>
                <IconWallet size={30} title="The Wallet App" />
                <Title
                  size={{ base: 'md', sm: 'xl' }}
                  className="no-underline"
                  order={3}
                >
                  The Wallet App
                </Title>
              </Group>
            </Link>
          </Group>

          <Group display={{ base: 'none', sm: 'flex' }}>
            {user ? <LogoutButton /> : null }
          </Group>

          <Group display={{ sm: 'none' }}>
            {user && <Burger opened={drawerOpened} onClick={toggleDrawer} />}
          </Group>
        </Group>
      </header>
        <Drawer
          opened={drawerOpened}
          onClose={closeDrawer}
          zIndex={1000000}
          position="right"
          display={{ sm: 'none' }}
        >
          <Center m="sm">
            {user ? <LogoutButton withLabel onClick={closeDrawer}/> : null}
          </Center>
        </Drawer>
    </>
  )
}
