// Sử dụng API của OpenStreetMap Nominatim để lấy địa chỉ từ lat/lng
export async function getAddressFromCoords(latitude, longitude) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;
    const response = await fetch(url);
    const data = await response.json();
    // Ưu tiên hiển thị display_name hoặc address.road, address.city
    return data.display_name || '';
  } catch (e) {
    return '';
  }
}
