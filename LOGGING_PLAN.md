# 🔍 Comprehensive Logging Plan for Book Me Now

## 📋 Overview
Add detailed logging throughout the application for debugging all frontend and backend actions, with color-coded console outputs and optional persistence.

## 1️⃣ Core Logger Utility (`packages/utils/src/logger.ts`)

### Features
Centralized logger with:
- Different log levels (DEBUG, INFO, WARN, ERROR)
- Color-coded console output
- Timestamp for each log
- Component/module identification
- Optional data serialization
- Environment-based filtering

### Log Methods
- `logger.debug()` - Detailed debugging info (blue)
- `logger.info()` - General information (green)
- `logger.warn()` - Warnings (yellow)
- `logger.error()` - Errors (red)
- `logger.api()` - API calls (cyan)
- `logger.state()` - State changes (magenta)
- `logger.render()` - Component renders (gray)

## 2️⃣ Frontend Logging Strategy

### Component Lifecycle Logging
- Mount/unmount events
- Props changes
- Re-render triggers
- Effect executions

### User Interaction Logging
- Button clicks
- Form submissions
- Navigation events
- Search queries
- Modal opens/closes

### Data Fetching Logging
- API request initiation
- Response received
- Cache hits/misses
- Loading states
- Error states

## 3️⃣ Backend/API Logging Strategy

### API Route Logging
- Request received (method, path, params)
- Request body/query
- Authentication status
- Response sent (status, data)
- Response time
- Error handling

### Database Operations
- Query execution
- Data mutations
- Cache operations
- Transaction status

## 4️⃣ State Management Logging

### Zustand Store Logging
- State changes
- Action dispatches
- Computed values

### React Query Logging
- Query execution
- Mutation triggers
- Cache updates
- Background refetches

## 5️⃣ Implementation Locations

```
packages/utils/src/
├── logger.ts                 # Core logger utility
└── index.ts                  # Export logger

apps/web/src/
├── lib/
│   └── logger-config.ts      # App-specific config
├── hooks/                    # Add logging to all hooks
├── services/                 # Log all API calls
├── stores/                   # Log state changes
├── app/
│   ├── api/                  # Log API routes
│   └── [pages]/              # Log page components
└── components/               # Log component actions
```

## 6️⃣ Environment Configuration

```env
# .env.local
NEXT_PUBLIC_LOG_LEVEL=debug        # debug | info | warn | error | off
NEXT_PUBLIC_LOG_COMPONENTS=true    # Log component lifecycle
NEXT_PUBLIC_LOG_API=true          # Log API calls
NEXT_PUBLIC_LOG_STATE=true        # Log state changes
NEXT_PUBLIC_LOG_PERFORMANCE=true  # Log render times
```

## 7️⃣ Example Logger Implementation

```typescript
// packages/utils/src/logger.ts
export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'off';

export class Logger {
  private module: string;
  private level: LogLevel;

  constructor(module: string) {
    this.module = module;
    this.level = (process.env.NEXT_PUBLIC_LOG_LEVEL as LogLevel) || 'info';
  }

  private format(level: string, message: string, data?: any) {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}] [${this.module}]`;

    if (data) {
      console.log(prefix, message, data);
    } else {
      console.log(prefix, message);
    }
  }

  debug(message: string, data?: any) {
    if (this.shouldLog('debug')) {
      console.log(`%c[DEBUG] [${this.module}] ${message}`, 'color: #3B82F6', data);
    }
  }

  info(message: string, data?: any) {
    if (this.shouldLog('info')) {
      console.log(`%c[INFO] [${this.module}] ${message}`, 'color: #10B981', data);
    }
  }

  warn(message: string, data?: any) {
    if (this.shouldLog('warn')) {
      console.warn(`%c[WARN] [${this.module}] ${message}`, 'color: #F59E0B', data);
    }
  }

  error(message: string, data?: any) {
    if (this.shouldLog('error')) {
      console.error(`%c[ERROR] [${this.module}] ${message}`, 'color: #EF4444', data);
    }
  }

  api(method: string, url: string, data?: any) {
    if (process.env.NEXT_PUBLIC_LOG_API === 'true') {
      console.log(`%c[API] ${method} ${url}`, 'color: #06B6D4', data);
    }
  }

  state(action: string, data?: any) {
    if (process.env.NEXT_PUBLIC_LOG_STATE === 'true') {
      console.log(`%c[STATE] ${action}`, 'color: #8B5CF6', data);
    }
  }

  render(component: string, time?: number) {
    if (process.env.NEXT_PUBLIC_LOG_PERFORMANCE === 'true') {
      const timeStr = time ? ` (${time}ms)` : '';
      console.log(`%c[RENDER] ${component}${timeStr}`, 'color: #6B7280');
    }
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
    const currentIndex = levels.indexOf(this.level);
    const targetIndex = levels.indexOf(level);
    return targetIndex >= currentIndex;
  }
}

export function createLogger(module: string) {
  return new Logger(module);
}
```

## 8️⃣ Example Component Implementation

```typescript
// SearchBar component with logging
import { createLogger } from '@book-me-now/utils';

const logger = createLogger('SearchBar');

export function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    logger.debug('SearchBar mounted');
    return () => logger.debug('SearchBar unmounted');
  }, []);

  const handleSearch = (value: string) => {
    logger.info('Search initiated', { query: value });
    setQuery(value);
    onSearch(value);
  };

  return (
    <input
      onChange={(e) => {
        logger.debug('Input changed', { value: e.target.value });
        handleSearch(e.target.value);
      }}
    />
  );
}
```

## 9️⃣ Example API Route Implementation

```typescript
// /api/properties/route.ts with logging
import { createLogger } from '@book-me-now/utils';

const logger = createLogger('API:Properties');

export async function GET(request: Request) {
  const start = Date.now();
  const { searchParams } = new URL(request.url);

  logger.api('GET', '/api/properties', { params: Object.fromEntries(searchParams) });

  try {
    const properties = await fetchProperties();
    const duration = Date.now() - start;

    logger.info(`Fetched ${properties.length} properties`, { duration });

    return NextResponse.json(properties);
  } catch (error) {
    logger.error('Failed to fetch properties', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
```

## 10️⃣ Example Hook Implementation

```typescript
// useProperties.ts with logging
import { createLogger } from '@book-me-now/utils';

const logger = createLogger('Hook:useProperties');

export function useProperties() {
  logger.debug('useProperties hook called');

  return useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      logger.info('Fetching properties...');
      const data = await propertyService.getAll();
      logger.info(`Fetched ${data.length} properties`);
      return data;
    },
    onError: (error) => {
      logger.error('Failed to fetch properties', error);
    },
    onSuccess: (data) => {
      logger.debug('Properties query successful', { count: data.length });
    }
  });
}
```

## 11️⃣ Example Store Implementation

```typescript
// useAuthStore.ts with logging
import { createLogger } from '@book-me-now/utils';

const logger = createLogger('Store:Auth');

export const useAuthStore = create((set) => ({
  user: null,

  login: (user) => {
    logger.state('login', { userId: user.id });
    set({ user, isAuthenticated: true });
  },

  logout: () => {
    logger.state('logout');
    set({ user: null, isAuthenticated: false });
  }
}));
```

## 12️⃣ Log Output Examples

```
[2025-01-17 10:23:45] [DEBUG] [SearchBar] User input changed: "New York"
[2025-01-17 10:23:46] [API] GET /api/properties/search?q=New York (pending)
[2025-01-17 10:23:47] [API] GET /api/properties/search ✓ 200 (125ms)
[2025-01-17 10:23:47] [STATE] properties.setSearchResults: 8 items
[2025-01-17 10:23:47] [RENDER] PropertyCard x8 (45ms total)
[2025-01-17 10:23:48] [INFO] [Navigation] Route change: /search → /properties/1
[2025-01-17 10:23:49] [DEBUG] [PropertyDetail] Fetching property: id=1
[2025-01-17 10:23:50] [ERROR] [API] Failed to load property: 404
```

## 13️⃣ Benefits

1. **Debugging:** Trace exact user flows and data paths
2. **Performance:** Identify slow operations and bottlenecks
3. **Error Tracking:** Catch and log all errors with context
4. **Development:** Understand component behavior and state flow
5. **Production:** Optional remote logging for monitoring

## 14️⃣ Implementation Priority

1. **Phase 1: Core Setup**
   - [ ] Create logger utility in packages/utils
   - [ ] Add environment configuration
   - [ ] Export from utils package

2. **Phase 2: Critical Paths**
   - [ ] Add to all API routes
   - [ ] Add to authentication flow
   - [ ] Add to payment/Stripe integration

3. **Phase 3: Data Layer**
   - [ ] Add to all hooks
   - [ ] Add to all services
   - [ ] Add to Zustand stores
   - [ ] Add to React Query setup

4. **Phase 4: UI Layer**
   - [ ] Add to page components
   - [ ] Add to interactive components
   - [ ] Add to forms and modals

5. **Phase 5: Performance**
   - [ ] Add render time tracking
   - [ ] Add API response time tracking
   - [ ] Add bundle size impact analysis

## 15️⃣ Production Considerations

### Remote Logging (Future Enhancement)
```typescript
// Send logs to external service in production
if (process.env.NODE_ENV === 'production') {
  // Send to service like Sentry, LogRocket, or custom endpoint
  logger.addTransport(new RemoteTransport({
    endpoint: process.env.LOG_ENDPOINT,
    apiKey: process.env.LOG_API_KEY
  }));
}
```

### Performance Impact Mitigation
- Use log levels to control verbosity
- Disable debug logs in production
- Implement log sampling for high-traffic areas
- Use async logging for non-critical paths

## 16️⃣ Testing the Logger

```typescript
// logger.test.ts
describe('Logger', () => {
  it('should log at appropriate levels', () => {
    const logger = createLogger('Test');
    const consoleSpy = jest.spyOn(console, 'log');

    logger.info('Test message');
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should respect log level settings', () => {
    process.env.NEXT_PUBLIC_LOG_LEVEL = 'error';
    const logger = createLogger('Test');
    const consoleSpy = jest.spyOn(console, 'log');

    logger.debug('Debug message');
    expect(consoleSpy).not.toHaveBeenCalled();

    logger.error('Error message');
    expect(consoleSpy).toHaveBeenCalled();
  });
});
```

## 📝 Notes

- This logging system is designed for development and debugging
- In production, consider using proper observability tools
- Always sanitize sensitive data before logging
- Use structured logging for better searchability
- Consider log retention policies for storage management

---

*This plan provides complete visibility into the Book Me Now application for effective debugging and monitoring.*