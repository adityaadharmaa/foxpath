export const calculateCompletion = (data: any) => {
  if (!data) return 0;

  let score = 0;

  const personalFields = [
    "full_name",
    "phone",
    "address",
    "bio",
    "date_of_birth",
    "profile_picture_url",
  ];

  const scorePerField = 60 / personalFields.length;

  personalFields.forEach((field) => {
    if (data[field] && data[field] !== "") {
      score += scorePerField;
    }
  });

  if (data.education && data.education !== null) {
    score += 40;
  }

  return Math.round(score);
};

export const getProgressColor = (score: number) => {
  if (score < 50) return "bg-red-500";
  if (score < 80) return "bg-yellow-500";
  return "bg-green-500";
};
