/* Content pulled from hunthire.id (prototype only — images are hotlinked). */
window.HH = window.HH || {};

const img = (path, w = 900) =>
  `https://images.prismic.io/hunthire/${path}?auto=format,compress&w=${w}&q=80`;

HH.consultants = [
  { name: 'Citra Ovani', role: 'Chief Executive Officer', photo: img('Z7_-2Z7c43Q3gSdU_P1002359.jpg') },
  { name: 'Frans Belnando', role: 'Sr. Manager - Recruitment Consultant', photo: img('ZxDgboF3NbkBXqeN_ZuKLdhoQrfVKmACn_P1003327.jpg') },
  { name: 'Tinessia Melia Dhini', role: 'Recruitment Consultant', photo: img('ZxDgbYF3NbkBXqeL_ZuK7GRoQrfVKmAo__Tines.jpg') },
  { name: 'Xani Shania Sianipar', role: 'Recruitment Consultant', photo: img('ZxDgb4F3NbkBXqeO_ZuN797VsGrYSvUV1_P1003320.jpg') },
  { name: 'Jeanice Sukiat', role: 'Business Development Manager', photo: img('Z6sfIZbqstJ9-d3-_jeanicefoto.jpg') },
  { name: 'Etik Puspitasari', role: 'Project Recruitment Specialist', photo: img('aEZqj7h8WN-LV4fM_WhatsAppImage2025-06-09at11.54.59AM.jpeg') },
  { name: 'Talisha Alyani', role: 'Recruitment Consultant', photo: img('Z8fqZBsAHJWomH7v_P1332652.jpg') },
  { name: 'Trisha Aurelia', role: 'Recruitment Consultant', photo: img('aEZn6rh8WN-LV4ex__1150391.jpg') },
];

HH.news = [
  {
    title: 'HuntHire Salary Overviews 2025: Navigating Indonesia’s Evolving Pay Landscape',
    excerpt: 'A look at how compensation is shifting across industries and seniority levels.',
    tag: 'Salary',
    photo: img('Z8fCkRsAHJWomHzk_pexels-fauxels-3184638.jpg', 1200),
  },
  {
    title: 'Future Job Trends in Indonesia: Top Careers & Skills for 2025',
    excerpt: 'Looking for the best career opportunities in Indonesia? The job market is changing fast.',
    tag: 'Careers',
    photo: img('Z8UcrRsAHJWomCeY_pexels-kindelmedia-7688087.jpg', 1200),
  },
  {
    title: 'The Growing Demand for Biotechnology Professionals in Indonesia',
    excerpt: 'Why biotech talent has become one of the most contested pools in the region.',
    tag: 'Industry',
    photo: img('Z8AfFZ7c43Q3gSnK_iStock-1431904821.jpg', 1200),
  },
  {
    title: 'Leveraging AI in Executive Hiring While Prioritizing Consultant Development',
    excerpt: 'In the ever-evolving landscape of executive hiring, the fusion of tech and people matters.',
    tag: 'Recruitment',
    photo: img('ZuoymrVsGrYSvfMv_P1003433-Enhanced-NR.jpg', 1200),
  },
];
