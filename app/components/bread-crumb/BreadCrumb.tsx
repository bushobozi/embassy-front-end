/*
 <div>
      <div className="breadcrumbs text-sm">
        <ul>
          <li>
            <a>Embassy Staff Overview</a>
          </li>
          <li>
            <a>Embassy Staff List</a>
          </li>
          <li>Add Staff Member to Embassy</li>
        </ul>
      </div>
    </div>
*/ 
import { Link } from "react-router";

type BreadCrumbLink = {
  label: string;
  href?: string;
};

type BreadCrumbProps = {
  links: BreadCrumbLink[];
};

export default function BreadCrumb({ links }: BreadCrumbProps) {
  return (
    <div className="breadcrumbs text-sm mb-4">
      <ul>
        {links.map((link, index) => (
          <li key={index}>
            {link.href ? <Link to={link.href}>{link.label}</Link> : link.label}
          </li>
        ))}
      </ul>
    </div>
  );
}