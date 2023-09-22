////////////////////////////////////////////////////////////////////////////////
// 🛑 Nothing in here has anything to do with Remix, it's just a fake database
////////////////////////////////////////////////////////////////////////////////

import { matchSorter } from "match-sorter";
// @ts-ignore - no types, but it's a tiny function
import sortBy from "sort-by";
import invariant from "tiny-invariant";

type ContactMutation = {
  id?: string;
  first?: string;
  last?: string;
  avatar?: string;
  twitter?: string;
  email?: string;
  n_employed?:number;
  area?:string;
  notes?: string;
  favorite?: boolean;
};

export type ContactRecord = ContactMutation & {
  id: string;
  createdAt: string;
};

////////////////////////////////////////////////////////////////////////////////
// This is just a fake DB table. In a real app you'd be talking to a real db or
// fetching from an existing API.
const fakeContacts = {
  records: {} as Record<string, ContactRecord>,

  async getAll(): Promise<ContactRecord[]> {
    return Object.keys(fakeContacts.records)
      .map((key) => fakeContacts.records[key])
      .sort(sortBy("n_employed", "last"));
  },

  async get(id: string): Promise<ContactRecord | null> {
    return fakeContacts.records[id] || null;
  },

  async create(values: ContactMutation): Promise<ContactRecord> {
    const id = values.id || Math.random().toString(36).substring(2, 9);
    const createdAt = new Date().toISOString();
    const newContact = { id, createdAt, ...values };
    fakeContacts.records[id] = newContact;
    return newContact;
  },

  async set(id: string, values: ContactMutation): Promise<ContactRecord> {
    const contact = await fakeContacts.get(id);
    invariant(contact, `No contact found for ${id}`);
    const updatedContact = { ...contact, ...values };
    fakeContacts.records[id] = updatedContact;
    return updatedContact;
  },

  destroy(id: string): null {
    delete fakeContacts.records[id];
    return null;
  },
};

////////////////////////////////////////////////////////////////////////////////
// Handful of helper functions to be called from route loaders and actions
export async function getContacts(query?: string | null) {
  await new Promise((resolve) => setTimeout(resolve, 500));
  let contacts = await fakeContacts.getAll();
  if (query) {
    contacts = matchSorter(contacts, query, {
      keys: ["first", "last"],
    });
    
  }
  return contacts.sort(sortBy("n_employed", "last"));
}

export async function createEmptyContact() {
  const contact = await fakeContacts.create({});
  return contact;
}

export async function getContact(id: string) {
  console.log(id, 'id de los contac');
  return fakeContacts.get(id);
}

export async function updateContact(id: string, updates: ContactMutation) {
  const contact = await fakeContacts.get(id);
  if (!contact) {
    throw new Error(`No contact found for ${id}`);
  }
  await fakeContacts.set(id, { ...contact, ...updates });
  return contact;
}

export async function deleteContact(id: string) {
  fakeContacts.destroy(id);
}

[
  {
    avatar:
      "https://lh3.googleusercontent.com/pw/AIL4fc--Z3MTslBtR-dQewvhY0vma5hnYVlPwoDp1vsLiTloQgZXHFnU6lStzwnqCkP9pGnNn7WziBEeHo8wHRpX2YorYBipifqT3iCZ1Auf_bLNtGhbC8NtJ06UpGXTbOFSLP4zMePD80OumhljO97z2BHdc2HG2l46bVTYearrk2HCLqaPNnqOwN24spEjI4qiGaHppX-hT5_dry8ttsTA69kVt4KwN7rAfQhrBY41tdi2nTlS4tLdHnWPZ2bm5YaX-B29Iboj8apbnXRFtH_aUryTxjFTqsFNCoKoOKO6hBMZuKoX-DsgV6EQjQwAETLm_-i3jWLbVLN-YQ8UuUi162I1EGuARsGW6iXEc-diwmtpeUbAaylPVr0la0CdQ5vUA9ixm00ld_cJ5HEuQ9Otc2KOLAeAXCtjW_HkIYAmQSK8od4_jabbm-djRnQ5V3d9Ra4jB-PDU-ubhuJdbD9kQwyIxLGhNaAIZuKG-Hyb0VFd8j1p7DqMrCAuEZp_N0d7uKlOfV_a79xFNloDaliVzmIbkMEZ39UCWUM7C-a_hZKNDB2pJspISfMDtB4b8G9UHLwqMrjwn7apZDBZlD1_yQGgXG5dREwuHlbR87eE2NjKVRTNI9MwdGIkJNJQHYYf94w0sJADgH1fTSMDZO3mklgUGfy9LfM6z4DPmX4CrR3coGz1Yaj3wBgufGEWU6HacL7qOMDJEoq-zVudbd63rrdIQ2ThaTStY2NE3U8MK2G5zC2jruKxNY0Q7gpgpt93sk0SH4F4nnVb8kswLgIyaxk3rPcyjM9wLCpbdyVy1S3Q5A0feYStTl3nXY7EZjHWV4LndN3Nx9bllEMdsKyXRI_BcrAYFuO3rPj9tRtxkAE1yj1astYePNLD7fCQp8QHH9kYSQFt11I8MWGcjlGeJVJT=w720-h960-s-no?authuser=0",
    first: "Kevin De Jesus",
    last: "Lopez Osorio",
    twitter: "9621649938",
    n_employed: 18,
    area: "Sistemas",
    notes: "Programador Web",
    email:"kevin.lopez@solbeautyandcare.com",
  },
  {
    avatar:
      "https://lh3.googleusercontent.com/pw/AIL4fc8kXZffQjas9j7kmDoe3menU63kRgaoarkxODR1c2N-UoP17R-LdomuLVAzS_gwIaHOl6kj7ZSt71lPJuTP0M-7pziTfmwnwRODhpxbHqlWoLjrYhYltSIVIsb2_NJBLgctmfFeUd8sX4gPJ-2JvkWvHF3T2JYGnKLaa3OM1CN_Uc3PVbtMH4LB8U_KLArwNknjiOHLlurewP0Q-OMHJEb7f78Nn_G5nyP5mm7reN20DzJ53PoEMkPABHiwn-TKei6_iSUjoHiqW2sRBxk0YEbl14xZ1RIcOftFsy8_v4elsgmDRvyyEHGxTPctuYsSWKMISuWRRp79ETU2OpzDfMVRMwQWuMvwlpwMzK5JDtGXnTy73iCPg71ZT7-SN93CnWmE2hKulosYSjpk0r7se5volvSGtnSKo8qtnKhqmBLTPQhwiq7zqY9sHGG2jeRqeiHmdB9cPsO30z3gZjrVXg84Au5A86mjLYJsV74LB5gY_NP0dE1Ddajuw7TrYZJl1F3mZbDZ9hQy3dzf7f81jMfY_6Y61Morq9UplNdyPNPuN1XH6L55lPSO2w3JLv4hUHsd-ORIh50lK8MYokneqqcWenzcQBTaqtLcXQ3j6LHZKoJFAeMv_6RLjh4PHEGlaZ4LLua6oQZlPUlGxoq5P1meCaCmXStNdNaL6t_rZB-5k5T1ZSLFBGhpd8ROUQONqhHnT8ApScCU5O0g9XcdiQ6H49HoH684iAh3JITu2cLrKiDe9ReV6ZlFLvzqGuoiHQiGmYTCZBlx-xDUa_bkuElrqSYYKrxH28K-KJU6lzdEjzS3r-y9gw9AWpSRuKqajI7jcueVqvxMqBNj_s5rcyFJ-0VmtJY6e_klAK2zuCiUkheQtTf1b_dUM_vwHNru8vdgraSzHxIP5WnBFA6X3lZD=w1001-h1001-s-no?authuser=0",
    first: "Alexis Manuel",
    last: "Arenas Segura",
    twitter: "5579484554",
    n_employed: 16,
    area: "Sistemas",
    notes: "Soy un programador",
    email:"manuel.segura@solbeautyandcare.com",
  },
  {
    avatar:
      "https://lh3.googleusercontent.com/pw/AIL4fc_3o6d5ZjGLed09OQXTOMgxX-BsLvtzBoaXWnFzBrve32_0K1TqMLYM9LOKEVyBbJX_Jzf4kthV9ljwNHy3Mn4T4514LaQFvSoxPjspBU-zTFA3PG8qsXokI_S82GpKclTrI3EifmXNKgf7HLdSXk5RD7vfdt5hkwqRJP0ETtJId0quigQqvl7NdDw8jh7yy11TPX3o2jNhcQCNZZxyQuDUePKdsEMEPefAm00IqjBU4D0NcnrEr2UjYRrq1-YPGC_Uz06qB05iG1FLPwgxNmx-SqSB2apZs6O1W2--Q-W2nNsY2dpVaiBq-k6gwuRjSTLGEbvI78MIsAcYGLBGIF-n3DVGu06kL_l2bIoAqI65BYhUw_7y6x-F8HIGFdrgmz2cnvTM3VtYVm2wQad9uOqKd4Ejsho-i7OtljNTTzDvK0IE20fY60IbDa-98LhpfGfjPftumer0GHA3d1hgREomQYmuLiOOtegD5j6WfRp0PN64jYyCUtQ4iFRHgtxiiDHc-c5tRqF6_Db_G55nVpcErPheq5_D0t-GbITCiQIdsnhYF3OwP7Qn3nx6tqHDlDjq0GMuRIu1dkiQi6vOTfV7A05uUkVmowWEGc0nPpl-0IzPfo16Hd-z5PZISfGQ7bNyQAXeCkOptSi5uDe9BCfEENt4iruk0ZojTlYHzXMrul4M6ui7gkej6BXEGn1dV6e1NOVMNrdQv4ADThEE6hrvPijzvvPT6-r-JJH0G7kduuB7ZNJviu_iuQPP5MezpSTgR4RTAJ8uqlACLyeNFx8OpDchTdTjHzrWa5rGudPdUJGzuzM7CxWvJ3ANlGfCR-TIl963HC4BH-KunF31Uh7NiTpV9gtrbM5WTjcuj1FeV3QId6NiM9xgDcY4isT1hqXH39e0DJGJuMZreoEWHq76=w215-h259-s-no?authuser=0",
    first: "Jose Manuel",
    last: "Castro Reyes",
    twitter: "5579484553",
    n_employed: 17,
    email:"jose.castro@solbeautyandcare.com",
    area: "Sistemas",
    notes: "Soy un programador",
  },
  {
    avatar:
      "https://sessionize.com/image/d14d-400o400o2-pyB229HyFPCnUcZhHf3kWS.png",
    first: "Andrea",
    last: "Espejel Velázquez",
    twitter: "5555555555",
    n_employed: 15,
    area: "Diseño Web",
    email:"andrea.espejel@solbeautyandcare.com",
    notes: "Diseñador Gráfico Web",
  },
  {
    avatar:
      "https://lh3.googleusercontent.com/pw/AIL4fc-uQM383IpjDqpvJlC_pnI0YJVpueo_wN1OawxRCIm76nL5vbGOA1vDv2mGdakFAH-eWU7U4NliNCm5_Y4tObeH8PkuvZ8v1ZXWB4jK_An020QErMwqBRKgyzM03mJV-Pqs7eb9VKPydaJx4aSyFmkkSeKs5RYVCOJyFzAHgv48fNKqoRJXBSAVXesmABiF9o_fjiUgeFsmPIZYjTr92ui9VPaKHnp5Y1x2lH9-5WIkhWio8tT48vJOgb0U0EFKB6uxzEsnJu2J9yWY1hsxrWR6n0Ras4uGPJN0TqKU_3V8PfGPyPXGe8OKBCAv82IRFd9K6AcE0f0NhbiNAo4DARt4XJU-NE4Rar5VyQTJ2XzGlS46-7cjdgvKiaPQ-PVQzR4ZMFo7lj_LhSOjgOLLakpJ-n2bJX7lbHW8y3PrR3TZrA2C8yhRPKMzTaW0lGFceu6uXfqhmqvx58JEVncuGvaQ1O9vbm_nFkUVoej6A2IRbJjVJSz_qczeNLncK4lm6_TDV0MjNsWe58qfm996gXi3J1IC7IWKLXWE1e3ZV2LxgxgexiilqiPbQEAQ47ngPwZoNC1ObY4i9SYeiT3RJZLdsqjIXNag1hoW7A8lQ9H7NPyxhiXAeO6GAOplX4t885Ddzl9zKf8m3x6gh6YuRpMIap8WoW-rsiYb9oTl12UEZHjcbEYtbd_VQ2Xan2qJ3Vu2ERfOsyWuDHfHkBSvwFrN5kXLEeMOjhTmyCJTfkRenbwNU-WHvuzvao_7McdIGql-csW2ZUR6RBW-SkXX7mVBBddH8sk4NzsSqR9cNJDxk3Nxu3Pt8LnbU5Y00V49YGWiaNDugv5EQVuhXvpomNbuHZKOsNkgedELxBDn39qSwDopmBwOMH4wZR8qyjbmwR6KNkSBst6asJnELgcNPvD-=w997-h1001-s-no?authuser=0",
    first: "Alejandro",
    last: "Hernandez Sosa",
    twitter: "5555555555",
    email:"alejandro.sosa@solbeautyandcare.com",
    n_employed: 13,
    area: "Audiovisual",
    notes: "Editor de Video",
  },
  {
    avatar:
      "https://sessionize.com/image/d14d-400o400o2-pyB229HyFPCnUcZhHf3kWS.png",
    first: "Axel Armando",
    last: "Sánchez Torres",
    twitter: "5555555555",
    n_employed: 8,
    area: "Diseño Web",
    email:"axel.sanchez@solbeautyandcare.com",
    notes: "Editor de video",
  },
  {
    avatar:
      "https://sessionize.com/image/d14d-400o400o2-pyB229HyFPCnUcZhHf3kWS.png",
    first: "Edgar de Jesus",
    last: "Gonzalez Chay",
    twitter: "5555555555",
    email:"edgar.chay@solbeautyandcare.com",
    n_employed: 10,
    area: "Audiovisual",
    notes: "Editor de Video",
  },
  {
    avatar:
      "https://sessionize.com/image/d14d-400o400o2-pyB229HyFPCnUcZhHf3kWS.png",
    first: "Guadalupe Ana Karen",
    last: "Juarez Díaz",
    twitter: "5555555555",
    n_employed: 7,
    area: "Diseño Web",
    email:"ana.diaz@solbeautyandcare.com",
    notes: "Asistente Audiovisual",
  },
  {
    avatar:
      "https://lh3.googleusercontent.com/pw/AIL4fc8gheqKt5x7DwJqh1VqFDOK5b8qUMXEcNfrxKkozkGmyhkQDLk9T0EnaT9xNPqMgcxNvRmwPQIJgL5tFSe5TyRDaNC6da5so_gwpRQvjyzaauJlLKMITqqyHMOXN1SQQ3zepyWqqFEqx46WMPKQNH_GAgK0_96-_yzRfJBCnCF5nlPM8f39tuH1U4PRYCqqu2EqVNTp6vHFMduomyKPgwLcWcTN7aKRgiqjS6ICj86hO2QHp1vy8mKGGlVq58dE3NccKPNts1jGflxlhbCQLz8q5xYzUnnykmzb0Xg6736h5hX3q_Lfmgw6M-ghoxXcE5kt7qLQEC8EFpu8EJigtgIQWeNaB46VSoHJ1wPGEULaAMVZ0MINXEVBw9Z1o6z-t3infpymaw1YY7eB4XR1SECBX2vfLdXH1mflIFX_ioB6OP-IEgcUvJWafmrWummW-yYZ70DHYhaAkGwEvrzO8cbFCBsA5-nUUA2eBWqJTdnXUPM2FEmGKwyVcgm22mT6u1uRJRhzDYfaafvR5kJhC6BQp-ovkXb-xIP9e270DL_WVrrhA_MHPDD5n8bWzc1Cy8tAXIxaw5qPbgcVimHYhYz8lSNYPgdVdkKVam7ueVXItOSW1rn60pX7rS-RUJXabJX7Cl8zXLiEwhHNHIvjnp9_d694AF2oOjUDj-on_rL1prJaie5ifWxn_3bnAwUuPSxZh8fJ0Jl4omunghYWcs0L-4W80jdeiX4RxFt_Ff5TZ31kvTI7TlX6dotBHaY1YV5J6aJREQ8jgf9w1DfUKXIAfP_75HDyQCBeUH4sAAW6WmqkMYZJEF3twAJhvZmEjV0H40GRaHN3095LmHmTTFqSCwCQ_bF2QxeiZyGRKePrZU3EL3u3cw3-RpMKdoyJdWpRnzoUqTInoz4KpeiLUXaE=w1000-h1001-s-no?authuser=0",
    first: "Luis Alberto",
    last: "Zuñiga Trujillo",
    twitter: "5555555555",
    email:"luis.trujillo@solbeautyandcare.com",
    n_employed: 14,
    area: "Audiovisual",
    notes: "Editor de Video",
  },
  {
    avatar:
      "https://sessionize.com/image/d14d-400o400o2-pyB229HyFPCnUcZhHf3kWS.png",
    first: "Javier",
    last: "Garcia Rivera",
    twitter: "5555555555",
    email:"javier.garcia@solbeautyandcare.com",
    n_employed: 12,
    area: "Audiovisual",
    notes: "Editor de Fotografia",
  },
].forEach((contact) => {
  fakeContacts.create({
    ...contact,
    id: `${contact.first.toLowerCase()}-${contact.last.toLocaleLowerCase()}`,
  });
});
