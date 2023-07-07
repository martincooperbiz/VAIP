
const modelViewer1 = document.querySelector('#animation-demo');

async function changeTexture() {
  const imageUrl = "../assets/3d/color.jpg"; // Replace with the actual path to your image
  
  const texture = await modelViewer1.createTexture(imageUrl);
  // modelViewer1.model.materials[0].normalTexture.setTexture(texture);
  modelViewer1.model.materials[0].pbrMetallicRoughness.baseColorTexture.setTexture(texture);
}
modelViewer1.addEventListener('load', () => {
  changeTexture()
  
  
});