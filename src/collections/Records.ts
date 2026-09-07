import { CollectionConfig } from 'payload/types';

const Records: CollectionConfig = {
  slug: 'records',
  admin: {
    useAsTitle: 'memberName',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user?.role === 'admin',
  },
  fields: [
    {
      name: 'memberName',
      type: 'text',
      required: true,
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Heren', value: 'heren' },
        { label: 'Dames', value: 'dames' },
        { label: 'JO12', value: 'jo12' },
        { label: 'JO14', value: 'jo14' },
        { label: 'JO16', value: 'jo16' },
        { label: 'JO18', value: 'jo18' },
      ],
      required: true,
    },
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
      required: true,
    },
    {
      name: 'distance',
      type: 'number',
      required: true,
    },
    {
      name: 'time',
      type: 'text',
      required: true,
      placeholder: 'mm:ss.ms',
    },
    {
      name: 'date',
      type: 'date',
      required: true,
    },
    {
      name: 'location',
      type: 'text',
    },
  ],
  defaultSort: '-date',
};

export default Records;
