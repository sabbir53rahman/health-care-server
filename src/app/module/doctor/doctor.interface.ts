export interface IUpdateDoctorSpecialty {
  specialtyId: string;
  shouldDelete?: boolean;
}

export interface IUpdateDoctorPayload {
  doctor?: {
    name?: string;
    profilePhoto?: string;
    contactNumber?: string;
    appointmentFee?: number;
    address?: string;
    experience?: number;
    qualification?: string;
    currentWorkplace?: string;
    designation?: string;
    averageRating?: number;
  };
  specialties?: IUpdateDoctorSpecialty[];
}
