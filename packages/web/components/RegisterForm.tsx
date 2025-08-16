'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export default function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [preferredName, setPreferredName] = useState('');
  const [personalEmail, setPersonalEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [secondaryPhoneNumber, setSecondaryPhoneNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [postalAddress, setPostalAddress] = useState('');
  const [membershipId, setMembershipId] = useState('');
  const [organizationalUnit, setOrganizationalUnit] = useState('');
  const [region, setRegion] = useState('');
  const [usiNumber, setUsiNumber] = useState('');
  const [preferredContactMethod, setPreferredContactMethod] = useState('');
  const [blueCardNumber, setBlueCardNumber] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      await api.post('/users/', {
        email,
        password,
        contact: {
          first_name: firstName,
          last_name: lastName,
          email: email, // Ensure the contact's primary email is the same as the login email
          middle_name: middleName || undefined,
          preferred_name: preferredName || undefined,
          personal_email: personalEmail || undefined,
          phone_number: phoneNumber || undefined,
          secondary_phone_number: secondaryPhoneNumber || undefined,
          date_of_birth: dateOfBirth || undefined,
          gender: gender || undefined,
          postal_address: postalAddress || undefined,
          membership_id: membershipId || undefined,
          organizational_unit: organizationalUnit || undefined,
          region: region || undefined,
          usi_number: usiNumber || undefined,
          preferred_contact_method: preferredContactMethod || undefined,
          blue_card_number: blueCardNumber || undefined,
          license_number: licenseNumber || undefined,
        },
      });
      setSuccess('You are registered! Redirecting to login...');
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err: any) {
      console.error('Registration failed:', err);
      if (err.response && err.response.data && err.response.data.detail) {
        const errorDetail = err.response.data.detail;
        // Handle Pydantic validation errors, which are arrays of objects
        if (Array.isArray(errorDetail) && errorDetail.length > 0) {
          const firstError = errorDetail[0];
          const field = firstError.loc && firstError.loc.length > 1 ? firstError.loc[1] : 'Input';
          const message = firstError.msg;
          // Capitalize the field name for better display
          const formattedField = typeof field === 'string' ? field.charAt(0).toUpperCase() + field.slice(1) : 'Error';
          setError(`${formattedField}: ${message}`);
        } else if (typeof errorDetail === 'string') {
          // Handle standard string errors from FastAPI's HTTPException
          setError(errorDetail);
        } else {
          setError('An unexpected error occurred. Please check the console.');
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    }
  };

  const renderInput = (
    label: string,
    id: string,
    type: string,
    value: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    required = false
  ) => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1">
        <input
          id={id} name={id} type={type} required={required} value={value} onChange={onChange}
          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">Account Details</h3>
                <p className="mt-1 text-sm text-gray-500">This will be your login information.</p>
              </div>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                {renderInput('Login Email', 'email', 'email', email, (e) => setEmail(e.target.value), true)}
                {renderInput('Password', 'password', 'password', password, (e) => setPassword(e.target.value), true)}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">Personal Information</h3>
                <p className="mt-1 text-sm text-gray-500">Please provide your legal name and contact details.</p>
              </div>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                {renderInput('First Name', 'first_name', 'text', firstName, (e) => setFirstName(e.target.value), true)}
                {renderInput('Last Name', 'last_name', 'text', lastName, (e) => setLastName(e.target.value), true)}
                {renderInput('Middle Name', 'middle_name', 'text', middleName, (e) => setMiddleName(e.target.value))}
                {renderInput('Preferred Name', 'preferred_name', 'text', preferredName, (e) => setPreferredName(e.target.value))}
                {renderInput('Date of Birth', 'date_of_birth', 'date', dateOfBirth, (e) => setDateOfBirth(e.target.value))}
                {renderInput('Gender', 'gender', 'text', gender, (e) => setGender(e.target.value))}
                {renderInput('Personal Email', 'personal_email', 'email', personalEmail, (e) => setPersonalEmail(e.target.value))}
                {renderInput('Phone Number', 'phone_number', 'tel', phoneNumber, (e) => setPhoneNumber(e.target.value))}
                {renderInput('Secondary Phone', 'secondary_phone_number', 'tel', secondaryPhoneNumber, (e) => setSecondaryPhoneNumber(e.target.value))}
                {renderInput('Postal Address', 'postal_address', 'text', postalAddress, (e) => setPostalAddress(e.target.value))}
              </div>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}
            {success && <p className="text-sm text-green-600">{success}</p>}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

