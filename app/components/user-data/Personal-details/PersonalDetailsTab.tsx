import UserPhoto from "./UserPhoto";
import PersonalInformation from "./PersonalInformation";
import IdentificationInformation from "./IdentificationInformation";
import EmergencyContacts from "./EmergencyContacts";
import WorkInformation from "./WorkInformation";

interface UserInfo {
  id: string;
  username: string;
  email: string;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  gender: string | null;
  embassy: number;
  profile_picture: string | null;
  phone_number: string | null;
  work_phone_number: string | null;
  work_email: string | null;
  position: string | null;
  personal_email: string | null;
  role: string | null;
  department: string | null;
  bio: string;
  passport_number: string | null;
  national_id_number: string | null;
  drivers_license_number: string | null;
  emergency_contact_name: string | null;
  emergency_contact_relationship: string | null;
  emergency_contact_phone_number: string | null;
  emergency_contact_email: string | null;
  can_manage_visas: boolean;
  can_manage_passports: boolean;
  can_approve_publications: boolean;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  date_of_birth: string | null;
  last_login: string;
  date_joined: string;
  created_at: string;
  updated_at: string;
  address?: string | null;
  social_media_links?: {
    linkedin: string;
    twitter: string;
  } | null;
}

interface PersonalDetailsTabProps {
  UserInfo: UserInfo;
  formatDate: (dateString: string | null) => string;
}

export default function PersonalDetailsTab({
  UserInfo,
  formatDate,
  userId,
  token,
  onUpdateSuccess,
}: PersonalDetailsTabProps & {
  userId: string;
  token: string;
  onUpdateSuccess: () => void;
}) {
  return (
    <div className="flex justify-between w-full container mt-8 mb-16 mx-auto">
      <UserPhoto
        profile_picture={UserInfo.profile_picture}
        firstName={UserInfo.first_name}
        lastName={UserInfo.last_name}
        userId={userId}
        token={token}
        onUpdateSuccess={onUpdateSuccess}
      />
      <div className="2/3">
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <PersonalInformation
              id={UserInfo.id}
              firstName={UserInfo.first_name}
              middleName={UserInfo.middle_name}
              lastName={UserInfo.last_name}
              email={UserInfo.email}
              phoneNumber={UserInfo.phone_number}
              dateOfBirth={formatDate(UserInfo.date_of_birth)}
              gender={UserInfo.gender}
              address={UserInfo.address || null}
              socialMediaLinks={UserInfo.social_media_links || null}
              userId={userId}
              token={token}
              onUpdateSuccess={onUpdateSuccess}
            />
            <IdentificationInformation
              nationalIdNumber={UserInfo.national_id_number}
              passportNumber={UserInfo.passport_number}
              driversLicenseNumber={UserInfo.drivers_license_number}
              userId={userId}
              token={token}
              onUpdateSuccess={onUpdateSuccess}
            />
          </div>
          <EmergencyContacts
            emergencyContactName={UserInfo.emergency_contact_name}
            emergencyContactPhone={UserInfo.emergency_contact_phone_number}
            emergencyContactEmail={UserInfo.emergency_contact_email}
            emergencyContactRelationship={
              UserInfo.emergency_contact_relationship
            }
            userId={userId}
            token={token}
            onUpdateSuccess={onUpdateSuccess}
          />
          <WorkInformation
            workEmail={UserInfo.work_email}
            workPhoneNumber={UserInfo.work_phone_number}
            role={UserInfo.role}
            department={UserInfo.department}
            position={UserInfo.position}
            userId={userId}
            token={token}
            onUpdateSuccess={onUpdateSuccess}
          />
        </div>
      </div>
    </div>
  );
}
