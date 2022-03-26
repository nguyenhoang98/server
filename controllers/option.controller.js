import subVn from 'sub-vn';

export const provincesController = async (req, res) => {
  try {
    const provinces = subVn.getProvinces();
    return res.status(200).json({
      success: true,
      message: 'get provinces success',
      provinces,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const districtController = async (req, res) => {
  const { province_code } = req.params;
  try {
    const districtAll = subVn.getDistricts();
    const district = districtAll.filter(
      item => item.province_code === province_code
    );
    return res.status(200).json({
      success: true,
      message: 'get district success',
      district,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const wardsController = async (req, res) => {
  const { district_code } = req.params;
  try {
    const wardAll = subVn.getWards();
    const ward = wardAll.filter(item => item.district_code === district_code);
    return res.status(200).json({
      success: true,
      message: 'get wardAll success',
      ward,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
