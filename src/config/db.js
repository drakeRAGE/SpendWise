import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb+srv://dragbos:dragbos@spendwise.mrg9bbz.mongodb.net/?retryWrites=true&w=majority&appName=Spendwise', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

connectDB();