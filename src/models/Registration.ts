import mongoose, { Schema } from "mongoose";

const registrationSchema = new Schema({
  eventId: { type: Schema.Types.ObjectId, required: true },
  teamName: { type: String, required: true },
  leadName: { type: String, required: true },
  leadEmail: { type: String, required: true },
  leadPhone: { type: String, required: true },
  leadUSN: { type: String, required: true },
  teamMembers: [{
    name: { type: String, required: true },
    usn: { type: String }
  }],
  registeredAt: { type: Date, default: Date.now }
}, { timestamps: true });

registrationSchema.index({ eventId: 1, leadEmail: 1 }, { unique: true });

export const RegistrationModel = mongoose.models.Registration || mongoose.model("Registration", registrationSchema);
