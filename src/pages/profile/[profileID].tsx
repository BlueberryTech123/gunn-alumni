// React Components
import Head from 'next/head';
import AutoResizingTextArea from '@/components/shared/AutoResizingTextArea';
import Image from 'next/image';

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { SocialIcon } from 'react-social-icons';
import { HiOutlineX, HiPlus } from 'react-icons/hi';
// react icons: social media
import { BsYoutube, BsDiscord, BsLinkedin, BsSnapchat } from 'react-icons/bs';
import { FaFacebook, FaInstagram, FaTiktok } from 'react-icons/fa';
import { TiSocialTwitter } from 'react-icons/ti';
import DefaultPFP from 'public/images/default_pfp.png';

// supabase
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import SB_serveronly from '@/lib/utils/dbserveronly';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';

// TODO: store this type somewhere else!

type ProfileData = {
  userId: string;
  userPfp: string;
  name: string;
  bio: string;
  contact: {
    location: string;
    phone: string;
    email: string;
    socialMedia: string[];
  };
};

const dummyProfileData: ProfileData = {
  userId: '0001',
  userPfp: '/images/dylan.png',
  name: 'Lorem Ipsum',
  bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. \n \n << Add Bio Above >>',
  contact: {
    location: 'City, State',
    phone: '000-000-0000',
    email: 'lorem.ipsum@gmail.com',
    socialMedia: [
      'facebook.com/',
      'instagram.com/',
      'linkedin.com',
      'twitter.com/',
      'youtube.com/watch?v=QKr_0DMYV5g',
      'discord.com/',
      'snapchat.com/',
      'tiktok.com/'
    ]
  }
};

// These two arrays are corresponding with each other
const socialMediaNamesList = [
  'youtube',
  'discord',
  'facebook',
  'instagram',
  'linkedin',
  'snapchat',
  'twitter',
  'tiktok'
];
const socialMediaIconsList = [
  BsYoutube,
  BsDiscord,
  FaFacebook,
  FaInstagram,
  BsLinkedin,
  BsSnapchat,
  TiSocialTwitter,
  FaTiktok
];

export default function ProfilePage({
  userName,
  userId,
  ...props
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();

  const supabase = useSupabaseClient();
  const session = useSession();

  const [editName, setEditName] = useState<string>(userName || 'User Name');

  const [lockState, setLockState] = useState<'locked' | 'unlocked'>('locked');

  const [socialMedias, setSocialMedias] = useState(
    dummyProfileData.contact.socialMedia
  );
  const [contacts, setContacts] = useState<
    Omit<ProfileData['contact'], 'socialMedia'>
  >(dummyProfileData.contact); // TODO: hacky typing, but the awkward object structure somewhat forces my hand here

  const [bio, setBio] = useState(props.userBio);
  const [email, setEmail] = useState(props.userEmail);
  const [pfp, setPfp] = useState(props.userPfp);

  const handleEdit = () => {
    setLockState('unlocked');
  };

  const handleSave = async () => {
    // TODO: add for social media icons, links, location, etc
    await supabase.from('profiles').update({ bio }).eq('id', userId);
    await supabase.from('profiles').update({ email }).eq('id', userId);
    setLockState('locked');
  };

  const updatePfp = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (session === null) return;

    const file = event.target.files![0];
    const avatarPath = `${session.user.id}-avatar`;

    const { error: uploadError } = await supabase.storage
      .from('avatar')
      .upload(avatarPath, file, {
        cacheControl: '3600',
        upsert: true
      });
    if (uploadError !== null) {
      console.log(uploadError);
      alert('Failed to update profile picture.');
      return;
    }

    const { data } = await supabase.storage
      .from('avatar')
      .getPublicUrl(avatarPath);

    // update table (I'm not sure if this should be put here...)
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ pfp: data.publicUrl })
      .eq('id', session.user.id);
    if (updateError != null) {
      console.log(updateError);
      alert('Failed to update table with new url');
      return;
    }
  };

  const removeLink = () => {
    const copyArr = [...socialMedias];
    copyArr.splice(-1);
    setSocialMedias(copyArr);
    //somewhat hacky for now
  };

  const addLink = () => {
    setSocialMedias([...socialMedias, '']);
  };

  return (
    <div
      id="profile_wrapper"
      className="flex min-[900px]:flex-row flex-col gap-12 mx-auto w-full min-[900px]:p-[50px] p-[25px] justify-center"
    >
      <Head>
        <title>Gunn Alumni | Classmates</title>
        <meta name="description" content="Alumni Profiles" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="col-span-1 w-auto min-[900px]:min-w-[150px] max-w-[300px] min-[900px]:m-0 m-auto">
        <div id="pfp_wrapper">
          <div
            id="pfp_content"
            className="w-max relative mx-auto mb-4 group rounded-full overflow-hidden"
          >
            <div className="relative w-48 h-48">
              <Image
                src={pfp || DefaultPFP}
                alt="Profile Image"
                fill
                className="object-cover object-center"
              />
            </div>
            {lockState === 'unlocked' && (
              <>
                <input
                  id="pfp_file_upload"
                  className="hidden"
                  type="file"
                  name="pfpFileUpload"
                  accept=".png,.jpeg,.jpg"
                  onChange={async (event) => await updatePfp(event)}
                />
                <button
                  id="pfp_change"
                  className="hidden group-hover:block absolute inset-0 text-white bg-black/40"
                  onClick={() => {
                    document.getElementById('pfp_file_upload')?.click();
                  }}
                >
                  Change avatar
                </button>
              </>
            )}
          </div>
        </div>
        <input
          id="name"
          type="text"
          placeholder="Enter Name Here"
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          disabled={lockState === 'locked'}
          className="placeholder:text-stone-600 font-bold place-content-center text-center mb-4 w-[75%] outline-0 border-0 mx-[12.5%]"
        />

        {
          <div id="profileSocial_wrapper">
            {lockState === 'locked' ? (
              <div className="flex gap-4 mx-auto flex-wrap justify-center mb-4">
                {socialMedias.map((v, i) => (
                  <SocialIcon key={i} url={'https://' + v} />
                ))}
              </div>
            ) : (
              <div className="grid gap-4 mb-4">
                {socialMedias.map((v, i) => (
                  <div className="w-full flex" key={i}>
                    <div
                      id="links"
                      className="bg-black font-bold border-[black] border-y-3"
                    ></div>
                    <input
                      type="text"
                      placeholder={socialMedias[i]}
                      className="w-full placeholder:text-stone-600 px-[5px] outline-0 border-[black] border-x-[2px] border-y-[2px]"
                      onChange={(e) => (socialMedias[i] = e.target.value)}
                    />
                  </div>
                ))}
                <div className="items-stretch flex justify-between">
                  <button onClick={removeLink}>
                    {' '}
                    <HiOutlineX></HiOutlineX>
                  </button>
                  <button onClick={addLink}>
                    {' '}
                    <HiPlus></HiPlus>
                  </button>
                </div>
              </div>
            )}
          </div>
        }
      </div>

      <div
        id="profile_components"
        className="col-span-2 w-[100%] max-w-[650px]"
      >
        <div id="bio_wrapper" className="mb-6">
          <div id="bio_title" className="font-bold mb-1">
            About Me
          </div>
          <AutoResizingTextArea
            id="ta_content"
            rows={5}
            disabled={lockState === 'locked'}
            className="w-full px-3.5 py-2 resize-none bg-white border rounded-lg disabled:bg-gray-100 focus:outline-none focus-visible:ring-[3px]"
            defaultValue={bio || ''}
            onChange={(e) => setBio(e.target.value)}
          ></AutoResizingTextArea>
        </div>
        <AutoResizingTextArea
          id="ta_content"
          rows={5}
          disabled={lockState === 'locked'}
          className="w-full px-3.5 py-2 resize-none bg-white border rounded-lg disabled:bg-gray-100 focus:outline-none focus-visible:ring-[3px]"
          defaultValue={email || ''}
          onChange={(e) => setEmail(e.target.value)}
        ></AutoResizingTextArea>

        {/* {Object.entries(contacts).map(([key, value]) => (
          <div
            title="contact_wrapper"
            id={key.toLowerCase() + '_wrapper'}
            className="mb-6"
            key={key}
          >
            <div
              title="contact_title"
              id={key.toLowerCase() + '_title'}
              className="font-bold mb-1"
            >
              {key.charAt(0).toUpperCase() + key.toLowerCase().slice(1)}
            </div>
            <AutoResizingTextArea
              id="ta-content"
              rows={1}
              disabled={lockState === 'locked'}
              placeholder={value}
              className="w-full px-3.5 py-2 resize-none bg-white border rounded-lg disabled:bg-gray-100 focus:outline-none focus-visible:ring-[3px]"
              defaultValue={value}
            ></AutoResizingTextArea>
          </div>
        ))} */}
      </div>

      {/* Edit Profile */}
      {userId === session?.user.id && (
        <div id="edit_lock_icon" className="self-end">
          {lockState === 'locked' ? (
            <button
              className="w-fit px-[15px] py-[5px] text-white bg-black rounded"
              onClick={handleEdit}
            >
              EDIT
            </button>
          ) : (
            <button
              className="w-fit px-[15px] py-[5px] text-white bg-blue-900 rounded"
              onClick={handleSave}
            >
              SAVE
            </button>
          )}
        </div>
      )}
    </div>
  );
}

interface ProfileProps {
  userBio: string | null;
  userName: string | null;
  userPfp: string | null;
  userEmail: string | null;
  userId: string;
}

export const getServerSideProps: GetServerSideProps<ProfileProps> = async (
  context
) => {
  const id = context.params?.profileID;

  const { data, error } = await SB_serveronly.from('profiles')
    .select(
      'bio,pfp,current_location,email,phone_num,social_media,preferred_name'
    )
    .eq('id', id);

  return {
    props: {
      userBio: data === null ? '' : data[0].bio,
      userName: data === null ? '' : data[0].preferred_name,
      userPfp: data === null ? '' : data[0].pfp,
      userEmail: data === null ? '' : data[0].email,
      userId: id as string
    }
  };
};
