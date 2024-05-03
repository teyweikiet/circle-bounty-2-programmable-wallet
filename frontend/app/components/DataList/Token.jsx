import { useState } from 'react'
import { Card, Text, Button, Group, Stack, ScrollArea } from '@mantine/core'

import { useGetWalletBalances } from '@/app/hooks/wallets'
import { TransferForm } from '@/app/components/Forms'
import { IconSend } from '@tabler/icons-react'

export function TokenCard ({ tokenBalance, walletId }) {
  const [showForm, setShowForm] = useState(false)
  return (
    <Card
      shadow="sm"
      padding="xl"
      miw='350px'
      h="250px"
      style={{ alignSelf: 'stretch' }}
    >
      {
        showForm
          ? (<TransferForm
              tokenBalance={tokenBalance}
              walletId={walletId}
              onClose={() => setShowForm(false)}
            />)
          : (<Stack align='center' justify="center" h="100%">
              <Text mb={0}>{tokenBalance.amount}</Text>
              <Text>{tokenBalance.token.symbol}</Text>
              <Button
                disabled={tokenBalance.amount <= 0}
                onClick={() => setShowForm(true)}
              >
                <IconSend />&nbsp;Transfer
              </Button>
            </Stack>)
      }
    </Card>
  )
}

export function TokenCards ({ walletId }) {
  const { data } = useGetWalletBalances(walletId)

  return (
    <ScrollArea>
    <Group
      wrap='nowrap'
      m="md"
      style={{
        boxSizing: 'border-box'
      }}
    >
      {
        (data?.tokenBalances || []).map((tokenBalance) => <TokenCard key={tokenBalance.token.id} tokenBalance={tokenBalance} walletId={walletId}/>)
      }
    </Group>
    </ScrollArea>
  )
}
