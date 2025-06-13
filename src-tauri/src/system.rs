use sysinfo::{Component, Components, Disks, Networks, System};
// Get List of system components
use wgpu::{Backend, Backends, Device, Instance, PowerPreference, RequestAdapterOptions, DeviceType};

struct SystemInfo {
    cpu_name: String,
    total_memory: u64,
    host_name: String,
    os_name: String,
    os_version: String,
    os_kernel_version: String,
    os_architecture: String,
    graphic_components: Vec<GraphicsComponent>,
    storage_component: Vec<StorageComponent>,
}

struct GraphicsComponent {
    name: String,
    vendor: String,
    vram: u64,
}

struct StorageComponent {
    name: String,
    file_system: String,
    total_space: u64,
    used_space: u64,
}

// TODO 
// Look into implmenting wmi (Windows), dmidecode (Linux/MacOS) for memory speed &
// motherboard/bios information

#[tauri::command]
pub fn get_components() {
    // Example taken from: https://crates.io/crates/sysinfo
    let mut sys = System::new_all();
    sys.refresh_all();
    println!("=> system:");
    // RAM and swap information:
    println!("total memory: {} bytes", sys.total_memory());
    println!("used memory : {} bytes", sys.used_memory());
    println!("total swap  : {} bytes", sys.total_swap());
    println!("used swap   : {} bytes", sys.used_swap());

    // Display system information:
    println!("System name:             {:?}", System::name());
    println!("System kernel version:   {:?}", System::kernel_version());
    println!("System OS version:       {:?}", System::os_version());
    println!("System host name:        {:?}", System::host_name());

    // Number of CPUs:
    println!("NB CPUs: {}", sys.cpus().len());

    // Display processes ID, name and disk usage:
    for (pid, process) in sys.processes() {
        println!("[{pid}] {:?} {:?}", process.name(), process.disk_usage());
    }

    // We display all disks' information:
    println!("=> disks:");
    let disks = Disks::new_with_refreshed_list();
    for disk in &disks {
        println!("{disk:?}");
    }

    // Network interfaces name, total data received and total data transmitted:
    let networks = Networks::new_with_refreshed_list();
    println!("=> networks:");
    for (interface_name, data) in &networks {
        println!(
            "{interface_name}: {} B (down) / {} B (up)",
            data.total_received(),
            data.total_transmitted(),
        );
        // If you want the amount of data received/transmitted since last call
        // to `Networks::refresh`, use `received`/`transmitted`.
    }

    // Components temperature:
    let components = Components::new_with_refreshed_list();
    println!("=> components:");
    for component in &components {
        println!("{component:?}");
    }
    
    // This is where I will be collecting the component data
    
    // Collecting CPU Name
    let cpu_name = sys.cpus().get(0)
        .map(|cpu| cpu.brand().to_string()) // Declares "cpu" as index and assigns brand value to string
        .unwrap_or_else(|| "Unknown CPU".to_string()); // assign cpu_name as "Unknown CPU" if 0 cpus in index or no brand value

    // Collecting Maximum amount of RAM
    // Convert to 64 Bit Float for more accurate memory calculation
    let total_memory = sys.total_memory() as f64;
    
    // constants for clarity in calculation
    // f64 (Floating-Point) - Holds decimals, fractions, positive, negative (Per IEEE 754)
    let kb: f64 = 1024.0;
    let mb: f64 = kb * kb;
    let gb: f64 = mb * kb;
    
    // Computing max memory to gigabyte
    let total_gib = total_memory / gb;
    let rounded_gib = total_gib.round() as u64; // u64 only holds whole numbers
    
    
    // Collecting Host Name
    let host_name = System::host_name().unwrap_or_else(|| "Unknown Host Name".to_string());
    
    // Collecting Operating System Name
    let os_name = System::name().unwrap_or_else(|| "Unknown OS".to_string());
    
    // Collecting Operating System Version
    let os_version = System::long_os_version().unwrap_or_else(|| "Unknown OS Version".to_string());
    
    // Collecting Operating System Kernel Version
    let os_kernel_version = System::kernel_version().unwrap_or_else(|| "Unknown Kernel Version".to_string());
    
    // Collecting Operating System Architecture
    let os_architecture = std::env::consts::ARCH.to_string();
    
    // GPU/WGPU Example 
    // https://github.com/gfx-rs/wgpu/blob/trunk/examples/standalone/01_hello_compute/src/main.rs
    let instance = wgpu::Instance::new(&wgpu::InstanceDescriptor::default());

    let mut adapters: Vec<_> = instance.enumerate_adapters(Backends::all());

    // define a simple priority order
    fn rank(device_type: DeviceType) -> u8 {
        match device_type {
            DeviceType::DiscreteGpu => 0,
            DeviceType::IntegratedGpu => 1,
            DeviceType::VirtualGpu    => 2,
            DeviceType::Cpu           => 3,
            _                         => 4,
        }
    }

    // pick the adapter with lowest rank
    adapters.sort_by_key(|a| rank(a.get_info().device_type));
    let primary = &adapters[0];
    let primary_gpu = primary.get_info().name;
    // TEMP Keep so that info appears in Threads & Variables
    // let _keep_info = info.clone();
    
    println!("Host Name: {}", host_name);
    println!("Operating System Version: {}", os_version);
    println!("Operating System Architecture: {}", os_architecture);
    println!("Operating System Kernel Version: {}", os_kernel_version);
    println!("Operating System: {}", os_name);
    println!("CPU Name: {}", cpu_name);
    println!("Primary GPU: {}", primary_gpu);
    println!("Max Memory: {} GB", rounded_gib);
    
    // // Return the components list
    // components.iter().cloned().collect()
}