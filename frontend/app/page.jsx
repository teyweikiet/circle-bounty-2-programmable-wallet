'use client'

import { Accordion, Badge, Tabs, Title, List, Stack } from '@mantine/core'
import { IconSettings, IconUsers, IconWallet } from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

import { AuthOnly } from '@/app/components/Auth'
import { useListWallets } from '@/app/hooks/wallets'
import { useCircleContext } from '@/app/hooks/circle'
import { CircularProgress } from '@/app/components/Loading'
import { ContactList, TokenCards } from '@/app/components/DataList'
import { ContactForm } from '@/app/components/Forms'
import { useListContacts } from '@/app/hooks/contacts'
import { WalletForm } from './components/Forms/Wallet'
import { useAuthContext } from './hooks/auth'

export default function Page () {
  const { data, isLoading } = useListWallets()
  const { execute } = useCircleContext()

  const supabase = createClientComponentClient()
  const { user } = useAuthContext()

  const { data: contacts, isLoading: isLoadingContacts } = useListContacts(supabase, user?.id)

  const items = (data?.wallets || []).map((item) => (
    <Accordion.Item key={item.id} value={item.id}>
      <Accordion.Control icon={<IconWallet />}>
        {item.address}&nbsp;
        <Badge color="blue">{item.blockchain}</Badge>
      </Accordion.Control>
      <Accordion.Panel>
        <TokenCards walletId={item.id}/>
      </Accordion.Panel>
    </Accordion.Item>
  ))

  const handleRestorePin = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/users/pin/restore`, {
      method: 'POST'
    })
    const { userToken, encryptionKey, challengeId } = await res.json()
    execute({ userToken, encryptionKey, challengeId }, (error, result) => {
      if (error) {
        notifications.show({
          color: 'red',
          title: `Error: ${error?.message ?? 'Error!'}`
        })
        return
      }
      notifications.show({
        title: `Challenge: ${result?.type}`,
        message: `Status: ${result?.status}`
      })
    })
  }

  const handleUpdatePin = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/users/pin/update`, {
      method: 'POST'
    })
    const { userToken, encryptionKey, challengeId } = await res.json()
    execute({ userToken, encryptionKey, challengeId }, (error, result) => {
      if (error) {
        notifications.show({
          color: 'red',
          title: `Error: ${error?.message ?? 'Error!'}`
        })
        return
      }
      notifications.show({
        title: `Challenge: ${result?.type}`,
        message: `Status: ${result?.status}`
      })
    })
  }

  return (
    <AuthOnly>
      <Tabs
        defaultValue="wallets"
        inverted
        h="100%"
      >
        <Tabs.Panel
          value="contacts"
          pb="xs"
          h="calc(100% - 50px)"
          style={{
            position: 'relative'
          }}
        >
          {
            isLoadingContacts
              ? <CircularProgress />
              : (<>
                  <ContactList contacts={contacts}/>
                  <ContactForm />
                </>)
          }
        </Tabs.Panel>
        <Tabs.Panel
          value="wallets"
          pb="xs"
          h="calc(100% - 50px)"
          style={{
            position: 'relative'
          }}
        >
          {
            isLoading
              ? <CircularProgress />
              : (<>
                  <Accordion>
                    {items}
                  </Accordion>
                  <WalletForm createUserPin={!data?.wallets?.length} />
                </>)
          }
        </Tabs.Panel>
        <Tabs.Panel
          value="settings"
          pb="xs"
          h="calc(100% - 50px)"
        >
          {
            isLoading
              ? <CircularProgress />
              : data?.wallets?.length
                ? (<List
                    listStyleType="none"
                    type="unordered"
                  >
                    <List.Item
                      onClick={handleUpdatePin}
                      py="xs"
                      px="md"
                      style={{
                        cursor: 'pointer',
                        borderBottom: '1px solid lightgrey'
                      }}
                    >
                      Update PIN
                    </List.Item>
                    <List.Item
                      onClick={handleRestorePin}
                      py="xs"
                      px="md"
                      style={{
                        cursor: 'pointer',
                        borderBottom: '1px solid lightgrey'
                      }}
                    >
                      Forgot PIN
                    </List.Item>
                  </List>)
                : <Stack align='center' justify='center' h="100%">
                    <Title order={4}>Create wallet to get started!</Title>
                  </Stack>
          }
        </Tabs.Panel>

        <Tabs.List grow>
          <Tabs.Tab
            value="contacts"
            leftSection={<IconUsers />}
          >
            Contacts
          </Tabs.Tab>
          <Tabs.Tab
            value="wallets"
            leftSection={<IconWallet />}
          >
            Wallets
          </Tabs.Tab>
          <Tabs.Tab
            value="settings"
            leftSection={<IconSettings />}
          >
            Settings
          </Tabs.Tab>
        </Tabs.List>
      </Tabs>
    </AuthOnly>
  )
}
