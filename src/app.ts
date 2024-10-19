import { Server } from './server';

const PORT = process.env.PORT || 3000;

new Server().server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
