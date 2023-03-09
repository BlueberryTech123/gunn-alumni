import Head from "next/head";
import ImgButton from "@/components/donate/ImageButton/ImgButton";
import FormInput from "@/components/donate/Forms/FormInput";
import { StandardButton } from "@/components/shared/Button";

/* TODO:
 * Page Structure:
 *  - complete rest of donate form
 *  - update ImgButton component to change onclick (hooks?)
 *  - create new component to link the states of individual ImgButtons together
 *     - e.g. clicking on one ImgButton will disable/un-highlight the others
 * CSS:
 *  - polish up & mobile compatibility
 */

const formCSS = "border-2 border-gray-300 bg-gray-100 rounded-md px-1 py-1";

const formSettings = [
    {
        title: "Name",
        type: "text",
        tailwindCSS: formCSS,
    },
    {
        title: "Email",
        type: "email",
        placeholder: "name@email.com",
        tailwindCSS: formCSS,
    },
    {
        title: "Phone Number",
        type: "tel",
        placeholder: "555-555-5555",
        pattern: "[0-9]{3}-[0-9]{3}-[0-9]{4}",
        tailwindCSS: formCSS,
    },
    {
        title: "Address",
        type: "text",
        placeholder: "Enter your address",
        tailwindCSS: formCSS,
    },
    {
        title: "Address Line 2",
        type: "text",
        tailwindCSS: formCSS,
    },
    {
        title: "Country", //replace with FormSelect later
        type: "text",
        tailwindCSS: formCSS,
    },
    {
        title: "City",
        type: "text",
        tailwindCSS: formCSS,
    },
];

const donationOptionSettings = [
  {
    text: "Donation Option 1",
    imageURL: "bg-[url('/images/dylan.png')]",
  },
  {
    text: "Donation Option 2",
    imageURL: "bg-[url('/images/dylan.png')]",
  },
  {
    text: "Donation Option 3",
    imageURL: "bg-[url('/images/dylan.png')]",
  },
];

export default function Donate() {
  return (
    <>
      <Head>
        <title>Gunn Alumni | Donate</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/images/dylan.png" />
      </Head>
      <div className="box-border px-4 py-4 md:px-24 md:py-10 lg:px-48 lg:py-10 flex flex-col gap-y-4 justify-center items-center">
        <div className="w-full box-border rounded-xl">
          <h1 className="font-bold text-xl">Donation Options</h1>
          <div className="w-full box-border flex items-stretch gap-2 mt-2 flex-col lg:flex-row">
            {donationOptionSettings.map((data, i) => (
              <ImgButton key={i} text={data.text} imageURL={data.imageURL} />
            ))}
          </div>
        </div>
        <div className="flex flex-col box-border grow gap-y-2 mt-4 rounded-xl shadow-xl px-4 md:px-8 py-8 w-full lg:px-16">
          <form className="flex w-full">
            <div className="w-full box-border flex flex-col gap-y-4 items-center">
              <div className="flex w-full justify-center items-center space-x-8 flex-col">
                <div className="text-xl">I want to donate: </div>
                <div className="flex mt-4">
                  <div className="py-2 px-8 rounded-full bg-gray-200">
                    <div className="font-semibold">Monthly</div>
                  </div>
                  <div className="py-2 px-8 rounded-full">
                    <div className="font-semibold">Yearly</div>
                  </div>
                  <div className="py-2 px-8 rounded-full">
                    <div className="font-semibold">Once</div>
                  </div>
                </div>
              </div>
              <h1 className="font-bold text-xl mt-4">Your Information</h1>
              <div className="w-full grid grid-cols-1 gap-x-4 gap-y-2">
                {formSettings.slice(0,3).map((data, i) => (
                  <FormInput
                    key={i}
                    title={data.title}
                    type={data.type}
                    placeholder={data.placeholder}
                    pattern={data.pattern}
                    tailwindCSS={data.tailwindCSS}
                  />
                ))}
              </div>
              <h1 className="font-bold text-xl mt-4">Billing Information</h1>
              <div className="w-full grid grid-cols-1 gap-x-4 gap-y-2">
                {formSettings.slice(3).map((data, i) => (
                    <FormInput
                        key={i}
                        title={data.title}
                        type={data.type}
                        placeholder={data.placeholder}
                        tailwindCSS={data.tailwindCSS}
                    />
                ))}
              </div>
              <div className="flex justify-center w-24">
                <StandardButton color="bg-primary" className="">
                  Submit
                </StandardButton>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
