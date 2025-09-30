import { Box, Flex, Text, Button, Code } from '@radix-ui/themes'

interface BSODProps {
  errorCode: string
  message: string
  onRestart?: () => void
}

export function BSOD({ errorCode, message, onRestart }: BSODProps) {
  return (
    <Box className="fixed inset-0 z-[9999] bg-blue-600 flex items-center justify-center p-8">
      <Flex direction="column" gap="6" className="max-w-2xl">
        <Text size="8" weight="bold" className="text-white">
          :(
        </Text>

        <Flex direction="column" gap="4">
          <Text size="5" weight="medium" className="text-white">
            Your AI Desktop ran into a problem and needs to restart.
          </Text>

          <Text size="3" className="text-blue-100">
            {message}
          </Text>

          <Code className="bg-blue-800 text-blue-100 p-4 rounded">
            Error Code: {errorCode}
          </Code>

          <Text size="2" className="text-blue-200">
            If you call the support person, give them this info:
            <br />
            STOP: 0x{errorCode.padStart(8, '0')}
          </Text>
        </Flex>

        {onRestart && (
          <Button
            size="3"
            variant="solid"
            onClick={onRestart}
            className="bg-white text-blue-600 hover:bg-blue-50 cursor-pointer"
          >
            Restart Desktop
          </Button>
        )}

        <Text size="1" className="text-blue-300">
          🤖 Generated with Emagine - AI Desktop Environment
        </Text>
      </Flex>
    </Box>
  )
}
