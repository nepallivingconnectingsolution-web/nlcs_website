import { Helmet } from 'react-helmet-async';
import { company } from '../data/content.js';

const SITE_URL = 'https://nlcsitservice.com';

export default function OrganizationJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: company.name,
    legalName: company.legalName,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description: company.blurb,
    email: company.email,
    telephone: company.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: company.address,
      addressCountry: 'NP',
    },
    sameAs: company.socials.map((s) => s.href),
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(data)}</script>
    </Helmet>
  );
}
