# ApiSorcery - Angular Example

This is an Angular 18 + TypeScript example application that demonstrates API integration using ApiSorcery.

## Features

- ✅ User Management (CRUD operations)
- ✅ Search and Filter
- ✅ Pagination
- ✅ Form Validation
- ✅ Image Upload
- ✅ Status Management
- ✅ Type-safe API calls with ApiSorcery

## Tech Stack

- **Angular 18** - Modern web framework
- **TypeScript** - Type safety
- **NG-ZORRO** - Ant Design for Angular
- **RxJS** - Reactive programming
- **Axios** - HTTP client
- **ApiSorcery** - API code generation
- **Day.js** - Date manipulation

## Prerequisites

- Node.js >= 22.0.0
- npm >= 10.0.0

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Generate API Client Code

```bash
npm run swagger
```

This will generate TypeScript API client code from the OpenAPI specification.

### 3. Start Development Server

```bash
npm start
```

The application will be available at: http://localhost:9527/

## Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm run watch` - Build in watch mode
- `npm test` - Run unit tests
- `npm run lint` - Run linter
- `npm run format` - Format code with Prettier
- `npm run swagger` - Generate API client code

## Project Structure

```
apisorcery-example-angular/
├── src/
│   ├── apis/
│   │   └── auto/          # Auto-generated API code
│   ├── app/
│   │   ├── components/    # Reusable components
│   │   ├── services/      # Angular services
│   │   ├── models/        # TypeScript interfaces
│   │   ├── utils/         # Utility functions
│   │   └── pages/
│   │       └── user/      # User management module
│   ├── environments/      # Environment configurations
│   ├── index.html         # HTML entry point
│   ├── main.ts            # Application entry
│   └── styles.scss        # Global styles
├── .apisorceryrc.json        # ApiSorcery configuration
├── angular.json           # Angular CLI configuration
├── proxy.conf.json        # Development proxy configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Project dependencies
```

## API Configuration

The application uses ApiSorcery to generate type-safe API client code. Configuration is in `.apisorceryrc.json`:

```json
{
  "application": {
    "language": "ts",
    "outputDir": "./src/apis/auto"
  },
  "servers": [
    {
      "code": "demo",
      "version": 3,
      "enabled": true,
      "source": "https://apisorcery.com/demo-api/swagger-json",
      "returnLevel": "second",
      "returnSecondField": "data",
      "baseStrategy": "always",
      "httpClientStrategy": "once"
    }
  ]
}
```

## Development

### Angular Components

This project uses Angular's standalone components with modern patterns:

```typescript
@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, FormsModule, NzTableModule],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  // Component logic
}
```

### Services

Angular services handle business logic and API calls:

```typescript
@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor() {}
  
  async getUsers(params: any) {
    return await getUserPaged(params);
  }
}
```

### Adding New Features

1. Generate/update API client code: `npm run swagger`
2. Create services in `src/app/services/`
3. Create components in `src/app/components/` or `src/app/pages/`
4. Update routing if needed

### Code Style

- Follow Angular style guide
- Use standalone components
- Use TypeScript for type safety
- Format code with Prettier before committing

## Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Deployment

Use the provided deployment script:

```bash
./deploy_prod.sh
```

## Version Information

- Node version: >= 22.0.0
- npm version: >= 10.0.0
- Angular version: 18.2.0
- NG-ZORRO version: 18.2.0
- ApiSorcery version: Latest

## License

MIT
