import mongoose from 'mongoose';

const candidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String,required:true },
},{timestamps:true});



export const Candidate =
  mongoose.models.Candidate || mongoose.model('Candidate', candidateSchema);