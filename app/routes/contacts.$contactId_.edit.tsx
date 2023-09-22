import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData, useNavigate } from "@remix-run/react";
import invariant from "tiny-invariant";

import { getContact, updateContact } from "../data";

export const action = async ({ params, request }: ActionFunctionArgs) => {
  invariant(params.contactId, "Missing contactId param");
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  await updateContact(params.contactId, updates);
  return redirect(`/contacts/${params.contactId}`);
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.contactId, "Missing contactId param");
  const contact = await getContact(params.contactId);
  if (!contact) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ contact });
};

export default function EditContact() {
  const { contact } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  return (
    <Form id="contact-form" method="post">
      <p>
        <span>Nombre</span>
        <input
          defaultValue={contact.first}
          aria-label="Nombres (s)"
          name="first"
          type="text"
          placeholder="Nombres (s)"
        />
        <input
          aria-label="Apellidos"
          defaultValue={contact.last}
          name="last"
          placeholder="Last"
          type="Apellidos"
        />
      </p>
      <label>
        <span>Numero Telefonico</span>
        <input
          defaultValue={contact.twitter}
          name="twitter"
          placeholder="5555555555"
          type="text"
        />
      </label>
      <label>
        <span>Email</span>
        <input
          defaultValue={contact.email}
          name="email"
          placeholder="ejemplo@solbeautyandcare.com"
          type="text"
        />
      </label>
      <label>
        <span>Numero de empleado</span>
        <input
          defaultValue={contact.n_employed}
          name="n_employed"
          placeholder="1"
          type="text"
        />
      </label>
      <label>
        <span>Imagen</span>
        <input
          aria-label="Avatar URL"
          defaultValue={contact.avatar}
          name="avatar"
          placeholder="https://example.com/avatar.jpg"
          type="text"
        />
      </label>
      <label>
        <span>Departamento</span>
        <input
          defaultValue={contact.area}
          name="area"
          placeholder="Sistemas"
          type="text"
        />
      </label>
      <label>
        <span>Puesto</span>
        <input defaultValue={contact.notes} name="notes" placeholder="Diseñador"  />
      </label>
      <p>
        <button type="submit">Guardar</button>
        <button onClick={() => navigate(-1)} type="button">
          Cancelar
        </button>
      </p>
    </Form>
  );
}
