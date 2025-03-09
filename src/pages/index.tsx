import {
  AppShell,
  Box,
  Burger,
  Button,
  Center,
  Checkbox,
  Group,
  LoadingOverlay,
  Modal,
  NavLink,
  NumberInput,
  ScrollArea,
  Select,
  Stack,
  Text,
  Textarea,
  Title,
  useMantineTheme,
  Alert,
  Paper,
  Container,
  Divider,
  Badge,
  Tooltip,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import ExcalidrawFrame from '../components/ExcalidrawFrame';
import {
  IconBrandGoogle,
  IconBrandAws,
  IconBrandAzure,
  IconCode,
  IconPlus,
  IconRefresh,
  IconBug,
  IconCloudComputing,
} from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import TerraformFrame from '../components/TerraformFrame';
import askVertex, { type DiagramProposalInterface, type CloudProviderType } from '../lib/vertex';
import ExampleMenu from '../components/ExampleMenu';

type MainComponentType = 'diagram' | 'terraform';

const Index = () => {
  const theme = useMantineTheme();
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
  const [requirements, setRequirements] = useState(
    'I want to deploy a URL shortener service with 10,000 users per month'
  );
  const [isIncludeLoggingAndMonitoring, setIsIncludeLoggingAndMonitoring] = useState(true);
  const [budget, setBudget] = useState<string | number>('');
  const [cloudProvider, setCloudProvider] = useState<CloudProviderType>('GCP');
  const [visible, { close: hideLoading, open: showLoading }] = useDisclosure(false);
  const [generatedData, setGeneratedData] = useState<DiagramProposalInterface[]>([]);
  const [activeProposal, setActiveProposal] = useState<DiagramProposalInterface | null>(null);

  const [opened, { open, close }] = useDisclosure(false);

  const [mainComponent, setMainComponent] = useState<MainComponentType>('diagram');

  // Track the current proposal with a key to force re-render
  const [proposalKey, setProposalKey] = useState(1);

  // Function to force a complete re-render of the diagram
  const forceRerender = () => {
    console.log('Forcing complete re-render of diagram');
    setProposalKey(Date.now()); // Use timestamp to ensure uniqueness
  };

  // Function to safely set the active proposal
  const safeSetActiveProposal = (proposal: DiagramProposalInterface | null) => {
    console.log('Setting active proposal:', proposal?.title);

    // Validate the proposal has valid mermaid syntax
    if (proposal && (!proposal.diagram || typeof proposal.diagram !== 'string')) {
      console.error('Invalid proposal diagram:', proposal);
      return;
    }

    // Set the active proposal
    setActiveProposal(proposal);

    // Ensure we're on the diagram tab
    setMainComponent('diagram');
  };

  // Function to validate and fix mermaid syntax
  const validateAndFixMermaidSyntax = (
    proposals: DiagramProposalInterface[]
  ): DiagramProposalInterface[] => {
    return proposals.map((proposal) => {
      // Skip if no diagram
      if (!proposal.diagram) {
        console.warn('Proposal has no diagram:', proposal.title);
        return proposal;
      }

      // Ensure the diagram is a string
      if (typeof proposal.diagram !== 'string') {
        console.error('Proposal diagram is not a string:', proposal.title);
        return {
          ...proposal,
          diagram: '',
        };
      }

      // Ensure the diagram starts with a valid mermaid syntax
      let diagram = proposal.diagram.trim();

      // Add flowchart type if missing
      if (
        !diagram.startsWith('graph') &&
        !diagram.startsWith('flowchart') &&
        !diagram.startsWith('sequenceDiagram') &&
        !diagram.startsWith('classDiagram')
      ) {
        console.log('Adding flowchart type to diagram:', proposal.title);
        diagram = 'flowchart TD\n' + diagram;
      }

      return {
        ...proposal,
        diagram,
      };
    });
  };

  const generateDiagram = async () => {
    if (requirements.length > 0) {
      showLoading();
      const data = await askVertex({
        requirements: requirements,
        budget: typeof budget == 'string' ? null : budget,
        isIncludeLoggingAndMonitoring: isIncludeLoggingAndMonitoring,
        cloudProvider: cloudProvider,
      });

      // Validate and fix mermaid syntax
      const validatedData = validateAndFixMermaidSyntax(data);

      setGeneratedData(validatedData);
      hideLoading();
      close();
    }
  };

  const generateDiagramWithExample = (data: DiagramProposalInterface[]) => {
    // Validate and fix mermaid syntax
    const validatedData = validateAndFixMermaidSyntax(data);

    setGeneratedData(validatedData);
  };

  const proposalButton = (proposal: DiagramProposalInterface) => {
    // Define gradient backgrounds based on cloud provider
    const getGradient = (isActive: boolean) => {
      if (!isActive) return 'white';

      switch (cloudProvider) {
        case 'GCP':
          return 'linear-gradient(135deg, #4285F4 0%, #34A853 100%)';
        case 'AWS':
          return 'linear-gradient(135deg, #FF9900 0%, #232F3E 100%)';
        case 'Azure':
          return 'linear-gradient(135deg, #0078D4 0%, #5C2D91 100%)';
        default:
          return 'linear-gradient(135deg, #1a1b1e 0%, #2c2e33 100%)';
      }
    };

    const isActive = proposal.title === activeProposal?.title;

    return (
      <Button
        variant="default"
        style={{
          height: 70,
          background: getGradient(isActive),
          border: isActive ? 'none' : '1px solid #e9ecef',
          boxShadow: isActive ? '0 4px 12px rgba(0, 0, 0, 0.15)' : 'none',
          transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
          overflow: 'hidden',
          position: 'relative',
        }}
        onClick={() => {
          // If already selected, just return
          if (isActive) {
            console.log('Proposal already selected:', proposal.title);
            return;
          }

          // Log the proposal for debugging
          console.log('Switching to proposal:', proposal.title);
          console.log('Mermaid syntax:', proposal.diagram.substring(0, 100) + '...');

          // Force a complete re-render of the diagram
          forceRerender();

          // Set the active proposal directly
          safeSetActiveProposal(proposal);
        }}
      >
        {isActive && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '4px',
              height: '100%',
              background: 'white',
              opacity: 0.6,
            }}
          />
        )}
        <Text
          size="sm"
          fw={isActive ? 600 : 500}
          style={{
            textWrap: 'balance',
            color: isActive ? 'white' : theme.colors.dark[7],
            textShadow: isActive ? '0 1px 2px rgba(0, 0, 0, 0.2)' : 'none',
          }}
        >
          {proposal.title}
        </Text>
      </Button>
    );
  };

  // Update active proposal when generated data changes
  useEffect(() => {
    console.log('generatedData', generatedData);
    if (generatedData.length > 0) {
      // Reset the proposal key to force a re-render
      setProposalKey(1);

      // Set the first proposal as active
      safeSetActiveProposal(generatedData[0]);
    }
  }, [generatedData]);

  return (
    <>
      <Modal
        centered
        opened={opened}
        onClose={close}
        title={`New ${cloudProvider} Architecture`}
        size="lg"
        overlayProps={{
          blur: 3,
          opacity: 0.55,
        }}
      >
        <LoadingOverlay visible={visible} zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }} />
        <Paper p="md" withBorder>
          <Textarea
            placeholder="I want to build an E-commerce site with 10,000 users per month"
            autosize
            label="Requirements"
            description="Describe what you want to build in detail"
            minRows={8}
            maxRows={20}
            value={requirements}
            onChange={(e) => setRequirements(e.currentTarget.value)}
          ></Textarea>
          <Select
            mt={20}
            label="Cloud Provider"
            placeholder="Select a cloud provider"
            data={[
              { value: 'GCP', label: 'Google Cloud Platform (GCP)' },
              { value: 'AWS', label: 'Amazon Web Services (AWS)' },
              { value: 'Azure', label: 'Microsoft Azure' },
            ]}
            value={cloudProvider}
            onChange={(value) => setCloudProvider(value as CloudProviderType)}
            required
            leftSection={
              cloudProvider === 'GCP' ? (
                <IconBrandGoogle size={16} />
              ) : cloudProvider === 'AWS' ? (
                <IconBrandAws size={16} />
              ) : (
                <IconBrandAzure size={16} />
              )
            }
          />
          <NumberInput
            mt={20}
            label="Monthly Budget"
            placeholder="Optional"
            prefix="$"
            value={budget}
            onChange={(value) => setBudget(value)}
          />
          <Checkbox
            mt={20}
            mb={20}
            label={
              cloudProvider === 'GCP'
                ? 'Include Cloud Monitoring and Cloud Logging'
                : cloudProvider === 'AWS'
                ? 'Include AWS CloudWatch for monitoring and logging'
                : 'Include Azure Monitor and Azure Log Analytics'
            }
            checked={isIncludeLoggingAndMonitoring}
            onChange={(event) => setIsIncludeLoggingAndMonitoring(event.currentTarget.checked)}
          />
          <Center>
            <Button
              mt={10}
              w={200}
              onClick={() => generateDiagram()}
              disabled={requirements.length === 0 || !cloudProvider}
              leftSection={<IconCloudComputing size={16} />}
            >
              Generate
            </Button>
          </Center>
        </Paper>
      </Modal>
      <AppShell
        header={{ height: 70 }}
        navbar={{
          width: 300,
          breakpoint: 'sm',
          collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
        }}
        aside={{
          width: 320,
          breakpoint: 'md',
          collapsed: { desktop: false, mobile: true },
        }}
        padding="md"
        styles={{
          main: {
            backgroundColor: theme.colors.gray[0],
          },
        }}
      >
        <AppShell.Header style={{ borderBottom: `1px solid ${theme.colors.gray[2]}` }}>
          <Group h="100%" px="md" justify="space-between">
            <Group>
              <Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom="sm" size="sm" />
              <Burger opened={desktopOpened} onClick={toggleDesktop} visibleFrom="sm" size="sm" />
              <Title
                order={3}
                style={{
                  fontWeight: 800,
                  background: `linear-gradient(135deg, ${theme.colors.dark[9]}, ${theme.colors.dark[5]})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Cloud Architect AI
              </Title>
              <Badge variant="light" color="gray" size="lg">
                Beta
              </Badge>
            </Group>
            <Group>
              <ExampleMenu
                generateDiagramWithExample={generateDiagramWithExample}
                cloudProvider={cloudProvider}
              />
              <Button
                variant="filled"
                color="dark"
                onClick={() => {
                  open();
                }}
                leftSection={<IconPlus size={16} />}
              >
                New Project
              </Button>
              {process.env.NODE_ENV === 'development' && (
                <>
                  <Tooltip label="Debug information">
                    <Button
                      variant="outline"
                      color="gray"
                      size="sm"
                      onClick={() => {
                        console.log('Debug info:', {
                          activeProposal,
                          cloudProvider,
                          mainComponent,
                          proposalKey,
                          generatedData,
                        });

                        // Log the mermaid syntax for debugging
                        if (activeProposal?.diagram) {
                          console.log('Active proposal diagram:', activeProposal.diagram);
                        }

                        // Force a re-render of the diagram
                        forceRerender();
                      }}
                      style={{ marginRight: 5 }}
                      leftSection={<IconBug size={16} />}
                    >
                      Debug
                    </Button>
                  </Tooltip>
                  <Tooltip label="Reset diagram view">
                    <Button
                      variant="outline"
                      color="dark"
                      size="sm"
                      onClick={forceRerender}
                      leftSection={<IconRefresh size={16} />}
                    >
                      Reset View
                    </Button>
                  </Tooltip>
                </>
              )}
            </Group>
          </Group>
        </AppShell.Header>
        <AppShell.Navbar
          p="md"
          style={{
            borderRight: `1px solid ${theme.colors.gray[2]}`,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div>
            <NavLink
              label="Diagram"
              onClick={() => setMainComponent('diagram')}
              active={mainComponent === 'diagram'}
              leftSection={
                cloudProvider === 'GCP' ? (
                  <IconBrandGoogle size={16} stroke={1.5} />
                ) : cloudProvider === 'AWS' ? (
                  <IconBrandAws size={16} stroke={1.5} />
                ) : (
                  <IconBrandAzure size={16} stroke={1.5} />
                )
              }
            ></NavLink>
            <NavLink
              label="Terraform"
              onClick={() => setMainComponent('terraform')}
              active={mainComponent === 'terraform'}
              leftSection={<IconCode size={16} stroke={1.5} />}
            ></NavLink>

            <Divider my="md" />

            <Text size="xs" c="dimmed" mb="xs" fw={500}>
              ABOUT
            </Text>
            <Text size="xs" c="dimmed" mb="md" style={{ lineHeight: 1.4 }}>
              Cloud Architect AI helps you design cloud architectures using AI. Select a cloud
              provider, describe your requirements, and get instant diagrams and Terraform code.
            </Text>
          </div>

          <div style={{ marginTop: 'auto', marginBottom: '10px' }}>
            <Paper
              p="xs"
              radius="md"
              withBorder
              style={{
                backgroundColor: 'rgba(0,0,0,0.02)',
                borderColor: theme.colors.gray[2],
              }}
            >
              <Text
                size="xs"
                style={{
                  textAlign: 'center',
                  padding: '5px 0',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'black',
                  fontWeight: 600,
                  fontSize: '12px',
                }}
              >
                Built with ❤️ by Siddhant
              </Text>
            </Paper>
          </div>
        </AppShell.Navbar>

        <AppShell.Main>
          <Paper shadow="xs" p="md" withBorder style={{ height: '100%', backgroundColor: 'white' }}>
            <div
              style={{
                display: mainComponent === 'diagram' ? 'block' : 'none',
                minHeight: '800px',
                height: '100%',
              }}
            >
              {activeProposal != null && activeProposal.diagram && (
                <ExcalidrawFrame
                  key={`diagram-${activeProposal.title}-${cloudProvider}-${proposalKey}`}
                  mermaidSyntax={activeProposal.diagram}
                  cloudProvider={cloudProvider}
                  proposalTitle={activeProposal.title}
                />
              )}
              {activeProposal != null && !activeProposal.diagram && (
                <Center style={{ height: '100%' }}>
                  <Alert title="Invalid Diagram" color="red">
                    The selected proposal does not contain a valid diagram. Please try another
                    proposal or generate a new diagram.
                  </Alert>
                </Center>
              )}
              {activeProposal == null && (
                <Center style={{ height: '100%' }}>
                  <Alert title="No Diagram" color="blue">
                    No diagram is currently selected. Please generate a diagram or select a
                    proposal.
                  </Alert>
                </Center>
              )}
            </div>
            <div
              style={{
                display: mainComponent === 'terraform' ? 'block' : 'none',
                minHeight: '800px',
                height: '100%',
              }}
            >
              <TerraformFrame
                codeString={activeProposal?.terraform ?? ''}
                cloudProvider={cloudProvider}
              />
            </div>
          </Paper>
        </AppShell.Main>
        <AppShell.Aside p="md" style={{ borderLeft: `1px solid ${theme.colors.gray[2]}` }}>
          <Title mb={15} order={4} style={{ fontWeight: 600 }}>
            Design Proposals
          </Title>
          <Stack>
            {generatedData.length === 0 && (
              <Paper withBorder p="md" style={{ backgroundColor: theme.colors.gray[0] }}>
                <Text size="sm" c="dimmed" style={{ textAlign: 'center' }}>
                  No proposals yet. Click "New Project" to generate some!
                </Text>
              </Paper>
            )}
            {generatedData[0] && (
              <Paper
                withBorder
                shadow="sm"
                p="xs"
                style={{
                  backgroundColor: 'transparent',
                  transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  border: 'none',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
                  },
                }}
              >
                {proposalButton(generatedData[0])}
              </Paper>
            )}
            {generatedData[1] && (
              <Paper
                withBorder
                shadow="sm"
                p="xs"
                style={{
                  backgroundColor: 'transparent',
                  transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  border: 'none',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
                  },
                }}
              >
                {proposalButton(generatedData[1])}
              </Paper>
            )}
            {generatedData[2] && (
              <Paper
                withBorder
                shadow="sm"
                p="xs"
                style={{
                  backgroundColor: 'transparent',
                  transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  border: 'none',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
                  },
                }}
              >
                {proposalButton(generatedData[2])}
              </Paper>
            )}
          </Stack>

          {activeProposal && (
            <>
              <Divider my="md" />
              <Title
                order={4}
                mb={15}
                style={{
                  fontWeight: 600,
                  background:
                    cloudProvider === 'GCP'
                      ? 'linear-gradient(135deg, #4285F4, #34A853)'
                      : cloudProvider === 'AWS'
                      ? 'linear-gradient(135deg, #FF9900, #232F3E)'
                      : 'linear-gradient(135deg, #0078D4, #5C2D91)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Details
              </Title>
              <ScrollArea h={300} type="auto">
                <Paper
                  withBorder
                  p="md"
                  mb={15}
                  style={{
                    borderRadius: '8px',
                    background: 'white',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    border: '1px solid #f1f3f5',
                  }}
                >
                  <Text
                    size="sm"
                    fw={600}
                    mb={5}
                    style={{
                      color: theme.colors.dark[7],
                      borderBottom: '1px solid #f1f3f5',
                      paddingBottom: '5px',
                    }}
                  >
                    Description
                  </Text>
                  <Text size="sm" mb={15} style={{ lineHeight: 1.5, color: theme.colors.dark[6] }}>
                    {activeProposal.description}
                  </Text>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '10px 0',
                    }}
                  >
                    <div
                      style={{
                        color: 'white',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                        padding: '10px 15px',
                        borderRadius: '8px',
                        textAlign: 'center',
                        width: 'auto',
                        minWidth: '200px',
                        maxWidth: '100%',
                        display: 'inline-block',
                      }}
                    >
                      <Text
                        fw={600}
                        size="sm"
                        style={{ color: 'black', whiteSpace: 'normal', wordBreak: 'break-word' }}
                      >
                        {activeProposal.runningCost}
                      </Text>
                    </div>
                  </div>
                </Paper>

                {/* <Paper withBorder p="md" style={{
                  borderRadius: '8px',
                  background: 'white',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  border: '1px solid #f1f3f5'
                }}>
                  <Text size="sm" fw={600} mb={10} style={{
                    color: theme.colors.dark[7],
                    borderBottom: '1px solid #f1f3f5',
                    paddingBottom: '5px'
                  }}>
                    Estimated Cost
                  </Text>

                </Paper> */}
              </ScrollArea>
            </>
          )}
        </AppShell.Aside>
      </AppShell>
    </>
  );
};

export default Index;
