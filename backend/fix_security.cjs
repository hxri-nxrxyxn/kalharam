const fs = require('fs');

let content = fs.readFileSync('server.js', 'utf8');

// 1. Imports
const imports = `import jwt from 'jsonwebtoken';
import { rateLimit } from 'express-rate-limit';
import { z } from 'zod';
import { authenticateAdmin, JWT_SECRET } from './middleware/auth.js';\n`;

content = content.replace(/import { fileURLToPath } from 'url';/, imports + "import { fileURLToPath } from 'url';");

// 2. CORS configuration (replace app.use(cors()))
content = content.replace(/app\.use\(cors\(\)\);/, `app.use(cors({
	origin: ['http://localhost:5173', 'http://localhost:5174'],
	credentials: true
}));`);

// 3. Rate limiter
const rateLimiter = `
const apiLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 1000, // limit each IP to 1000 requests per windowMs
	message: { error: 'Too many requests, please try again later.' }
});

const authLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 10, // 10 login attempts
	message: { error: 'Too many login attempts, please try again later.' }
});
app.use('/api', apiLimiter);
`;
content = content.replace(/app\.use\('\/api', \(req, res, next\) => \{/, rateLimiter + `\napp.use('/api', (req, res, next) => {`);

// 4. Protect admin routes
content = content.replace(/app\.use\('\/api', \(req, res, next\) => \{/, `app.use('/api/admin', authenticateAdmin);\n\napp.use('/api', (req, res, next) => {`);

// 5. Update POST /api/auth/login
const loginRegex = /app\.post\('\/api\/auth\/login', \(req, res\) => \{[\s\S]*?\}\);/;
const secureLogin = `app.post('/api/auth/login', authLimiter, (req, res) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			return res.status(400).json({ error: 'Email and password are required' });
		}
		
		// In a real app, query the admins table and use bcrypt. 
		// For demo, we hardcode the admin credentials.
		if (email === 'admin@kalharam.example' && password === 'demo1234') {
			const token = jwt.sign({ name: 'Admin', email, role: 'admin' }, JWT_SECRET, { expiresIn: '12h' });
			return res.json({ token, message: 'Logged in successfully' });
		} else {
			return res.status(401).json({ error: 'Invalid credentials. Please try again.' });
		}
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});`;
content = content.replace(loginRegex, secureLogin);

// 6. Fix SQL Injection in PUT /api/admin/products/:id
const sqlInjectionTarget = /let dbCol = key;[\s\S]*?fields\.push\(\`\$\{dbCol\} = \?\`\);\s*values\.push\(value\);\s*\}/;

const safeSql = `
			// STRICT WHITELIST to prevent SQL Injection
			const allowedColumns = {
				name: 'title',
				details: 'subtitle',
				category: 'categoryId',
				price: 'salePrice',
				offerPrice: 'mrp',
				stock: 'stock',
				sold: 'sold',
				demand: 'demand',
				deadStockDays: 'deadStockDays',
				imageId: 'imageId'
			};

			if (!(key in allowedColumns)) continue;
			
			const dbCol = allowedColumns[key];
			fields.push(\`\$\{dbCol\} = ?\`);
			values.push(value);
		}`;
content = content.replace(sqlInjectionTarget, safeSql);

// 7. Zod validation for POST /api/orders
const orderZodTarget = /const \{ customerName, email, phone, address, city, state, pin, total, items \} = req\.body;/;
const orderZodSchema = `
		const orderSchema = z.object({
			customerName: z.string().min(1),
			email: z.string().email(),
			phone: z.string().min(10),
			address: z.string().min(1),
			city: z.string().min(1),
			state: z.string().min(1),
			pin: z.string().min(1),
			total: z.number().min(0),
			items: z.array(z.object({
				id: z.string(),
				quantity: z.number().int().min(1),
				price: z.number().min(0).optional()
			})).min(1)
		});

		const parsed = orderSchema.safeParse(req.body);
		if (!parsed.success) {
			return res.status(400).json({ error: 'Invalid request data', details: parsed.error.issues });
		}
		const { customerName, email, phone, address, city, state, pin, total, items } = parsed.data;
`;
content = content.replace(orderZodTarget, orderZodSchema);

fs.writeFileSync('server.js', content);
