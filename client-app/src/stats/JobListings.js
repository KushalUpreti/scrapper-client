import React, { useState, useMemo } from "react";

const US_STATE_ABBREVIATIONS = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "DC",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
];

const extractStateAbbreviations = (text) => {
  const regex = /\b[A-Z]{2}\b/g;
  const matches = text.match(regex);
  return matches
    ? matches.filter((match) => US_STATE_ABBREVIATIONS.includes(match))
    : [];
};

const JobListings = ({ jobs }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const jobsPerPage = 25;

  // Extract unique states for the location filter
  const locations = jobs
    ? [
        ...new Set(
          jobs.flatMap((job) => extractStateAbbreviations(job.location))
        ),
      ]
    : [];
  const companies = jobs ? [...new Set(jobs.map((job) => job.company))] : [];
  const skills = jobs
    ? [
        ...new Set(
          jobs.flatMap((job) =>
            job.skills ? job.skills.replace("Skills: ", "").split(", ") : []
          )
        ),
      ]
    : [];

  // Filter jobs based on selected filters
  const filteredJobs = useMemo(() => {
    if (!jobs) return []; // Return empty array if jobs is null

    return jobs.filter(
      (job) =>
        (selectedLocation
          ? extractStateAbbreviations(job.location).includes(selectedLocation)
          : true) &&
        (selectedCompany ? job.company === selectedCompany : true) &&
        (selectedSkill
          ? job.skills && job.skills.includes(selectedSkill)
          : true) &&
        (searchTerm
          ? job.title.toLowerCase().includes(searchTerm.toLowerCase())
          : true)
    );
  }, [jobs, selectedLocation, selectedCompany, selectedSkill, searchTerm]);

  // Calculate the jobs to display on the current page
  const paginatedJobs = useMemo(() => {
    const startIndex = (currentPage - 1) * jobsPerPage;
    return filteredJobs.slice(startIndex, startIndex + jobsPerPage);
  }, [filteredJobs, currentPage, jobsPerPage]);

  // Calculate total pages
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  // Handle page navigation
  const goToPage = (page) => {
    setCurrentPage(page);
  };

  return (
    <main className="p-4 bg-gray-100 flex-1">
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-4">Job Listings</h1>

        {/* Display loading message if jobs is still loading */}
        {!jobs && (
          <div className="text-lg text-gray-500 flex items-center justify-center">
            Loading job listings...
          </div>
        )}

        {/* Filters Section */}
        {jobs && (
          <div className="flex flex-wrap gap-4 mb-6">
            <input
              type="text"
              placeholder="Search by job title"
              className="p-2 border border-gray-300 rounded-lg flex-1"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="p-2 border border-gray-300 rounded-lg"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              <option value="">All Locations</option>
              {locations.map((location, index) => (
                <option key={index} value={location}>
                  {location}
                </option>
              ))}
            </select>
            <select
              className="p-2 border border-gray-300 rounded-lg"
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
            >
              <option value="">All Companies</option>
              {companies.map((company, index) => (
                <option key={index} value={company}>
                  {company}
                </option>
              ))}
            </select>
            <select
              className="p-2 border border-gray-300 rounded-lg"
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
            >
              <option value="">All Skills</option>
              {skills.map((skill, index) => (
                <option key={index} value={skill}>
                  {skill}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Job Listings */}
        <div className="grid gap-4">
          {jobs && paginatedJobs.length > 0
            ? paginatedJobs.map((job, index) => (
                <div
                  key={index}
                  className="p-4 bg-white border border-gray-300 rounded-lg shadow-sm"
                >
                  <a
                    href={job.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xl font-semibold text-blue-600 hover:underline"
                  >
                    {job.title}
                  </a>
                  <div className="text-gray-500 text-sm mb-2">
                    Posted on {new Date(job.datePosted).toLocaleDateString()}
                  </div>
                  <div className="text-gray-700 mb-1">
                    <span className="font-semibold">Company:</span>{" "}
                    {job.company}
                  </div>
                  <div className="text-gray-700 mb-1">
                    <span className="font-semibold">Location:</span>{" "}
                    {job.location}
                  </div>
                  <div className="text-gray-700 mb-1">
                    <span className="font-semibold">Website:</span>{" "}
                    {job.website}
                  </div>
                  <div className="text-gray-700">
                    <span className="font-semibold">Skills:</span>{" "}
                    {job.skills?.replace("Skills: ", "") || "N/A"}
                  </div>
                </div>
              ))
            : jobs && (
                <div className="text-gray-500">
                  No job listings match your criteria.
                </div>
              )}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center items-center mt-6 space-x-2">
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => goToPage(index + 1)}
              className={`px-3 py-1 rounded-lg ${
                currentPage === index + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </main>
  );
};

export default JobListings;
