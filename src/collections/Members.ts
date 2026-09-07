import { CollectionConfig } from 'payload/types';

const Members: CollectionConfig = {
  slug: 'members',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user?.role === 'admin',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'gender',
      type: 'select',
      options: [
        { label: 'Mannelijk', value: 'm' },
        { label: 'Vrouwelijk', value: 'v' },
      ],
    },
    {
      name: 'birthYear',
      type: 'number',
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'personalRecords',
      type: 'array',
      fields: [
        {
          name: 'stroke',
          type: 'select',
          options: [
            { label: 'Vrijeslag', value: 'vrijeslag' },
            { label: 'Rugslag', value: 'rugslag' },
            { label: 'Schoolslag', value: 'schoolslag' },
            { label: 'Vlinderslag', value: 'vlinderslag' },
            { label: 'Wisselslag', value: 'wisselslag' },
          ],
        },
        {
          name: 'distance',
          type: 'number',
        },
        {
          name: 'time',
          type: 'text',
          placeholder: 'mm:ss.ms',
        },
        {
          name: 'date',
          type: 'date',
        },
      ],
    },
  ],
};

export default Members;
