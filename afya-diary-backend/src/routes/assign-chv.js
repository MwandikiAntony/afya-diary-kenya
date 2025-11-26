router.post("/assign-chv", async (req, res) => {
  const { patientId, chvId } = req.body;

  try {
    const patient = await Patient.findByIdAndUpdate(
      patientId,
      { chvId },
      { new: true }
    );

    if (!patient) return res.status(404).json({ message: "Patient not found" });

    return res.json({
      message: "Patient assigned to CHV successfully",
      patient,
    });
  } catch (err) {
    return res.status(500).json({ message: "Failed to assign patient" });
  }
});
