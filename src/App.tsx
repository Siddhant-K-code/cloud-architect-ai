import { MantineProvider, createTheme } from "@mantine/core";
import "@mantine/core/styles.css";
import Index from "./pages";

// Create a custom theme for a sleek, modern design
const theme = createTheme({
  primaryColor: 'dark',
  primaryShade: 8,
  colors: {
    // Custom color palette
    dark: [
      '#C1C2C5', // 0: lightest
      '#A6A7AB', // 1
      '#909296', // 2
      '#5C5F66', // 3
      '#373A40', // 4
      '#2C2E33', // 5
      '#25262B', // 6
      '#1A1B1E', // 7
      '#141517', // 8: darkest
      '#101113', // 9: even darker
    ],
    gray: [
      '#F8F9FA', // 0: lightest
      '#F1F3F5', // 1
      '#E9ECEF', // 2
      '#DEE2E6', // 3
      '#CED4DA', // 4
      '#ADB5BD', // 5
      '#868E96', // 6
      '#495057', // 7
      '#343A40', // 8
      '#212529', // 9: darkest
    ],
  },
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
  fontFamilyMonospace: 'Monaco, Courier, monospace',
  headings: {
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
    fontWeight: '600',
  },
  defaultRadius: 'md',
  components: {
    Button: {
      defaultProps: {
        radius: 'md',
      },
      styles: {
        root: {
          fontWeight: 600,
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
    Modal: {
      styles: {
        header: {
          fontWeight: 600,
        },
        title: {
          fontSize: '1.2rem',
        },
      },
    },
    AppShell: {
      styles: {
        main: {
          backgroundColor: '#f8f9fa',
        },
      },
    },
    NavLink: {
      styles: {
        root: {
          fontWeight: 500,
        },
      },
    },
    Tabs: {
      styles: {
        tab: {
          fontWeight: 500,
        },
      },
    },
  },
});

function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme="light">
      <Index></Index>
    </MantineProvider>
  );
}

export default App;
