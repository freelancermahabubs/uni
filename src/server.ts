import config from './app/config';
import app from './app';
import mongoose from 'mongoose';
main().catch(err => console.log(err));

async function main() {
  try {
    await mongoose.connect(config.database_url as string);

    app.listen(config.port, () => {
      console.log(` app listening on port ${config.port}`);
    });
  } catch (error) {
    console.log(error);
  }
}
