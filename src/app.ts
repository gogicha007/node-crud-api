import dotenv from 'dotenv'
import { Server } from './server';

dotenv.config()

const PORT = Number(process.env.PORT) || 3000;

new Server().server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
